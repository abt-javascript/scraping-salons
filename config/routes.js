'use strict';

const glob  = require("glob");
const path = require("path");
const promise = require("bluebird");
const _ = require("lodash");

const route = function () {
  let routes = [];

  glob.sync('./src/**/route.js').forEach((file) => {
    routes = _.concat(routes, require(path.resolve(file)));
  });

  return promise.all(routes).then(() => {
     return routes;
  });
}

module.exports = route
