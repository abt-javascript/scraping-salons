const cron = require('node-cron');

const maymay = require('../src/salon/maymay.js');
const magdalena = require('../src/salon/magdalena.js');
const saloncantik = require('../src/salon/saloncantik.js');
const anitasalon = require('../src/salon/anitasalon.js');
const fourlen = require('../src/salon/fourlen.js');
const moz5 = require('../src/salon/moz5.js');
const irwansalon = require('../src/salon/irwansalon.js');
const didosalon = require('../src/salon/didosalon.js');
const dianmustika = require('../src/salon/dianmustika.js');
const joanne = require('../src/salon/joanne.js');
const poetrespa = require('../src/salon/poetrespa.js');
const naomi = require('../src/salon/naomi.js');
const cbc = require('../src/salon/cbc.js');

function Job () {
  cron.schedule('0 0 * * *', function() {
    // maymay().then(() => {
    //   magdalena().then(() =>{
    //     saloncantik().then(() =>{
    //       anitasalon().then(() =>{
    //         fourlen().then(() => {
    //           moz5().then(() =>{
    //             irwansalon().then(() =>{
    //               didosalon().then(() => {
    //                 dianmustika().then(() =>{
    //                   joanne().then(() =>{
    //                     poetrespa().then(() => {
    //                       naomi().then(() => {
    //
    //                       });
    //                     });
    //                   });
    //                 });
    //               });
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });
    cbc();
  });

  return cron;
}

module.exports = Job
