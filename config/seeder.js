'use strict';

const glob  = require("glob");
const path = require("path");
const promise = require("bluebird");
const _ = require("lodash");

const seed = function () {
  let routes = [];

  glob.sync('./seed/**.js', {ignore:'index.js',dot:true}).forEach((file) => {
    const run = require(path.resolve(file));
  });
}

module.exports = seed
