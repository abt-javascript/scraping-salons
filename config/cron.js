const cron = require('node-cron');
const rp = require('request-promise');
const maymay = require('../src/salon/maymay.js');
const magdalena = require('../src/salon/magdalena.js');

function Job () {
  cron.schedule('* * * * *', function(){
    //maymay();
    magdalena();
  });

  return cron;
}

module.exports = Job
