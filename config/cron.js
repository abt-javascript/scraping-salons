const cron = require('node-cron');
const rp = require('request-promise');
const maymay = require('../src/salon/maymay.js');
const magdalena = require('../src/salon/magdalena.js');
const saloncantik = require('../src/salon/saloncantik.js');

function Job () {
  cron.schedule('0 0 * * *', function(){
    // maymay().then(() => {
    //   magdalena();
    // });
    saloncantik();
    
  });

  return cron;
}

module.exports = Job
