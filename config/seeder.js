'use strict';

const glob  = require("glob");
const path = require("path");
const promise = require("bluebird");
const _ = require("lodash");

const seed = async function () {
  let routes = [];

  var data = await new Promise((resolve, reject) => {
    glob.sync('./seed/**.js', {ignore:'index.js',dot:true}).forEach((file) => {
      const run = require(path.resolve(file));
      resolve(run)
    });
  });

  return data

}

module.exports = seed
