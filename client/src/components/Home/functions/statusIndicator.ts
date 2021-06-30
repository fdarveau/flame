import axios from 'axios';

import { urlParser } from '../../../utility/';

export const initializeStatusIndicators = () => {
  //updateAllStatusIndicators();
  return setInterval(function () {
    updateAllStatusIndicators();
  }, 300000); // Every 5 minutes
};

const updateAllStatusIndicators = () => {
  let apps = document.getElementsByClassName("app-link");
  for (var i = 0; i < apps.length; i++) {
    const _this: Element = apps[i];
    var link = _this.getAttribute("href");
    if (link) {
      var statusIndicators = _this.querySelectorAll("status-indicator");
      if (statusIndicators.length) {
        getStatus(link, statusIndicators[0]); // Should be only one. If needs change, update to pass the whole list.
        console.log(link);
      }
    }
  }
};

const getStatus = (url: string, statusIndicator: Element) => {
  axios
    .head(urlParser(url)[1].replace('http:', window.location.protocol))
    .then((data) => {
      clearStatus(statusIndicator);
      statusIndicator.setAttribute("positive", "positive");
    })
    .catch((err) => {
      clearStatus(statusIndicator);
      statusIndicator.setAttribute("negative", "negative");
    });
};

const clearStatus = (statusIndicator: Element) => {
  if (statusIndicator.attributes.getNamedItem("active")) {
    statusIndicator.attributes.removeNamedItem("active");
  }
  if (statusIndicator.attributes.getNamedItem("negative")) {
    statusIndicator.attributes.removeNamedItem("negative");
  }
  if (statusIndicator.attributes.getNamedItem("positive")) {
    statusIndicator.attributes.removeNamedItem("positive");
  }
};
