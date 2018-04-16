const cron = require('node-cron');

const maymay = require('../src/salon/maymay.js');
const magdalena = require('../src/salon/magdalena.js');
const saloncantik = require('../src/salon/saloncantik.js');
const anitasalon = require('../src/salon/anitasalon.js');
const fourlen = require('../src/salon/fourlen.js');
const moz5 = require('../src/salon/moz5.js');

function Job () {
  cron.schedule('*/3 * * * *', function() {
    // maymay().then(() => {
    //   magdalena().then(() =>{
    //     saloncantik().then(() =>{
    //       anitasalon().then(() =>{
    //         fourlen();
    //       });
    //     });
    //   });
    // });
moz5();
  });

  return cron;
}

module.exports = Job
