const cron = require('node-cron');
const rp = require('request-promise');
const maymay = require('../src/salon/maymay.js');

function Job () {
  cron.schedule('* * * * *', function(){
    maymay();
  });

  return cron;
}

module.exports = Job
