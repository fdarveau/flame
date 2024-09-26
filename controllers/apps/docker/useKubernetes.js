const App = require('../../../models/App');
const k8s = require('@kubernetes/client-node');
const Logger = require('../../../utils/Logger');
const logger = new Logger();
const loadConfig = require('../../../utils/loadConfig');
const Category = require('../../../models/Category');

const kubernetesDefaultCategory = {
  id: -3,
  name: 'Kubernetes',
  type: 'apps',
  isPinned: true,
  orderId: 999,
};

const useKubernetes = async (apps) => {
  const { useOrdering: orderType, unpinStoppedApps } = await loadConfig();

  let ingresses = null;

  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromCluster();
    const k8sNetworkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);
    await k8sNetworkingV1Api.listIngressForAllNamespaces().then((res) => {
      ingresses = res.body.items;
    });
  } catch {
    logger.log("Can't connect to the Kubernetes API", 'ERROR');
  }

  if (ingresses) {
    apps = await App.findAll({
      order: [[orderType, 'ASC']],
    });

    ingresses = ingresses.filter(
      (e) => Object.keys(e.metadata.annotations).length !== 0
    );

    const kubernetesApps = [];

    const categories = await Category.findAll({
      where: {
        type: 'apps'
      },
      order: [[orderType, 'ASC']]
    });

    if (!categories.find(category => category.id === kubernetesDefaultCategory.id)) {
      categories.push(await Category.create(kubernetesDefaultCategory));
    }

    for (const ingress of ingresses) {
      const annotations = ingress.metadata.annotations;

      if (
        'flame.pawelmalak/name' in annotations &&
        'flame.pawelmalak/url' in annotations &&
        /^app/.test(annotations['flame.pawelmalak/type'])
      ) {
        
        const names = annotations['flame.pawelmalak/name'].split(';');
        const urls = annotations['flame.pawelmalak/url'].split(';');
        const categoriesLabels = annotations['flame.pawelmalak/category'] ? annotations['flame.pawelmalak/category'].split(';') : [];
        const orders = annotations['flame.pawelmalak/order'] ? annotations['flame.pawelmalak/order'].split(';') : [];
        const icons = annotations['flame.pawelmalak/icon'] ? annotations['flame.pawelmalak/icon'].split(';') : [];

        for (let i = 0; i < names.length; i++) {            
          let category = categoriesLabels[i] ? categories.find(category => category.name.toUpperCase() === categoriesLabels[i].toUpperCase()) : kubernetesDefaultCategory;
          if (!category) {
            category = await createNewCategory(categoriesLabels[i]);
            if (category) {
              categories.push(category);
            } else {
              category = kubernetesDefaultCategory;
            }
          }

          kubernetesApps.push({
            name: names[i] || names[0],
            url: urls[i] || urls[0],
            icon: icons[i] || 'kubernetes',
            categoryId: category.id,
            orderId: orders[i] || 500,
          });
        }

        kubernetesApps.push({
          name: annotations['flame.pawelmalak/name'],
          url: annotations['flame.pawelmalak/url'],
          icon: annotations['flame.pawelmalak/icon'] || 'kubernetes',
        });
      }
    }

    if (unpinStoppedApps) {
      for (const app of apps) {
        await app.update({ isPinned: false });
      }
    }

    for (const item of kubernetesApps) {
      if (apps.some((app) => app.name === item.name)) {
        const app = apps.find((a) => a.name === item.name);
        await app.update({ ...item, isPinned: true });
      } else {
        await App.create({
          ...item,
          isPinned: true,
        });
      }
    }
  }
};

// TODO : Move somewhere else ?
async function createNewCategory(newCategoryName) {
  return await Category.create({
    name: newCategoryName,
    type: 'apps',
    isPinned: true,
    orderId: Number.MAX_SAFE_INTEGER //New category will always be last and can then be re-ordered manually by user
  });
}

module.exports = useKubernetes;
