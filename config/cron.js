const cron = require('node-cron');
const rp = require('request-promise');
const maymay = require('../src/scraping/maymay.js');

function Job () {
  cron.schedule('0 0 * * *', function(){
    maymay();
  });

  return cron;
}

module.exports = Job
