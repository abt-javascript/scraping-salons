const cron = require('node-cron');

const maymay = require('../src/salon/maymay.js');
const magdalena = require('../src/salon/magdalena.js');
const saloncantik = require('../src/salon/saloncantik.js');
const anitasalon = require('../src/salon/anitasalon.js');

function Job () {
  cron.schedule('0 0 * * *', function(){
    // `maymay().then(() => {
    //   magdalena().then(() =>{
    //     saloncantik();
    //   });
    // });`
    anitasalon();
  });

  return cron;
}

module.exports = Job
