const asyncWrapper = require('../middleware/asyncWrapper');
const ErrorResponse = require('../utils/ErrorResponse');
const App = require('../models/App');
const Config = require('../models/Config');
const { Sequelize } = require('sequelize');
const axios = require('axios');
const Logger = require('../utils/Logger');
const Category = require('../models/Category');
const { dockerDefaultCategory } = require('./category');
const logger = new Logger();
const k8s = require('@kubernetes/client-node');

// @desc      Create new app
// @route     POST /api/apps
// @access    Public
exports.createApp = asyncWrapper(async (req, res, next) => {
  // Get config from database
  const pinApps = await Config.findOne({
    where: { key: 'pinAppsByDefault' }
  });
  
  let app;

  let _body = {
    ...req.body,
    categoryId: parseInt(req.body.categoryId),
    isPinned: (pinApps && parseInt(pinApps.value))
  };

  if (req.file) {
    _body.icon = req.file.filename;
  }

  app = await App.create(_body);

  res.status(201).json({
    success: true,
    data: app
  });
});

// @desc      Get all apps
// @route     GET /api/apps
// @access    Public
exports.getApps = asyncWrapper(async (req, res, next) => {
  // Get config from database
  const useOrdering = await Config.findOne({
    where: { key: 'useOrdering' }
  });
  const useDockerApi = await Config.findOne({
    where: { key: 'dockerApps' }
  });
  const useKubernetesApi = await Config.findOne({
    where: { key: 'kubernetesApps' }
  });
  const unpinStoppedApps = await Config.findOne({
    where: { key: 'unpinStoppedApps' }
  });

  const orderType = useOrdering ? useOrdering.value : 'createdAt';
  let apps;

  if (useDockerApi && useDockerApi.value == 1) {
    let containers = null;

    try {
      let { data } = await axios.get(
        'http://localhost/containers/json?{"status":["running"]}',
        {
          socketPath: '/var/run/docker.sock'
        }
      );
      containers = data;
    } catch {
      logger.log("Can't connect to the docker socket", 'ERROR');
    }

    if (containers) {
      apps = await App.findAll({
        order: [[orderType, 'ASC']]
      });

      const categories = await Category.findAll({
        where: {
          type: 'apps'
        },
        order: [[orderType, 'ASC']]
      });

      containers = containers.filter(e => Object.keys(e.Labels).length !== 0);
      const dockerApps = [];
      for (const container of containers) {
        const labels = container.Labels;

        if (
          'flame.name' in labels &&
          'flame.url' in labels &&
          /^app/.test(labels['flame.type'])
        ) {
          const app = {
            name: labels['flame.name'],
            url: labels['flame.url'],
            icon: labels['flame.icon'] || 'docker',
            categoryId: dockerDefaultCategory.id,
            orderId: labels['flame.order'] || 1,
          }
          if (labels['flame.category']) {
            const category = categories.find(category => category.name.toUpperCase() === labels['flame.category'].toUpperCase());
            app.categoryId = category ? category.id : dockerDefaultCategory.id
          }
          dockerApps.push(app);
        }
      }

      if (unpinStoppedApps && unpinStoppedApps.value == 1) {
        for (const app of apps) {
          await app.update({ isPinned: false });
        }
      }

      for (const item of dockerApps) {
        if (apps.some(app => app.name === item.name)) {
          const app = apps.filter(e => e.name === item.name)[0];
          await app.update({ ...item, isPinned: true });
        } else {
          await App.create({
            ...item,
            isPinned: true
          });
        }
      }
    }
  }

  if (useKubernetesApi && useKubernetesApi.value == 1) {
    let ingresses = null;

    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromCluster();
      const k8sNetworkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);
      await k8sNetworkingV1Api.listIngressForAllNamespaces()
      .then((res) => {
          ingresses = res.body.items;
      });
    } catch {
      logger.log("Can't connect to the kubernetes api", 'ERROR');
    }

    if (ingresses) {
      apps = await App.findAll({
        order: [[orderType, 'ASC']]
      });

      ingresses = ingresses.filter(e => Object.keys(e.metadata.annotations).length !== 0);
      const kubernetesApps = [];
      for (const ingress of ingresses) {
        const annotations = ingress.metadata.annotations;

        if (
          'flame.pawelmalak/name' in annotations &&
          'flame.pawelmalak/url' in annotations &&
          /^app/.test(annotations['flame.pawelmalak/type'])
        ) {
          kubernetesApps.push({
            name: annotations['flame.pawelmalak/name'],
            url: annotations['flame.pawelmalak/url'],
            icon: annotations['flame.pawelmalak/icon'] || 'kubernetes'
          });
        }
      }

      if (unpinStoppedApps && unpinStoppedApps.value == 1) {
        for (const app of apps) {
          await app.update({ isPinned: false });
        }
      }

      for (const item of kubernetesApps) {
        if (apps.some(app => app.name === item.name)) {
          const app = apps.filter(e => e.name === item.name)[0];
          await app.update({ ...item, isPinned: true });
        } else {
          await App.create({
            ...item,
            isPinned: true
          });
        }
      }
    }
  }

  if (orderType == 'name') {
    apps = await App.findAll({
      order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']]
    });
  } else {
    apps = await App.findAll({
      order: [[orderType, 'ASC']]
    });
  }

  if (process.env.NODE_ENV === 'production') {
    // Set header to fetch containers info every time
    res.status(200).setHeader('Cache-Control', 'no-store').json({
      success: true,
      data: apps
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: apps
  });
});

// @desc      Get single app
// @route     GET /api/apps/:id
// @access    Public
exports.getApp = asyncWrapper(async (req, res, next) => {
  const app = await App.findOne({
    where: { id: req.params.id }
  });

  if (!app) {
    return next(
      new ErrorResponse(`App with id of ${req.params.id} was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: app
  });
});

// @desc      Update app
// @route     PUT /api/apps/:id
// @access    Public
exports.updateApp = asyncWrapper(async (req, res, next) => {
  let app = await App.findOne({
    where: { id: req.params.id }
  });

  if (!app) {
    return next(
      new ErrorResponse(`App with id of ${req.params.id} was not found`, 404)
    );
  }

  let _body = { ...req.body };

  if (req.file) {
    _body.icon = req.file.filename;
  }

  app = await app.update(_body);

  res.status(200).json({
    success: true,
    data: app
  });
});

// @desc      Delete app
// @route     DELETE /api/apps/:id
// @access    Public
exports.deleteApp = asyncWrapper(async (req, res, next) => {
  await App.destroy({
    where: { id: req.params.id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Reorder apps
// @route     PUT /api/apps/0/reorder
// @access    Public
exports.reorderApps = asyncWrapper(async (req, res, next) => {
  req.body.apps.forEach(async ({ id, orderId }) => {
    await App.update(
      { orderId },
      {
        where: { id }
      }
    );
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
