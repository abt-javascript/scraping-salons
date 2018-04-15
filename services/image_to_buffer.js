'use strict';
var request = require('request').defaults({ encoding: null });

async function buffer(url) {
  var img = await new Promise((resolve, reject) => {
    request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');

        return resolve(data);
      }

      reject(error);
    });
  });

  return img;
}

module.exports = buffer
