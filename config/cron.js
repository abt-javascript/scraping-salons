const cron = require('node-cron');
const seed = require('./seeder.js');
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
const royalgarden = require('../src/salon/royalgarden.js');
const tokyobelle = require('../src/salon/tokyobelle.js');
const umandaruspa = require('../src/salon/umandaruspa.js');
const natashaskin = require('../src/salon/natashaskin.js');
const estherhouse = require('../src/salon/estherhouse.js');
const zanitasalon = require('../src/salon/zanitasalon.js');

function Job () {
  cron.schedule('*/50 * * * *', function() {
    maymay().then(() => {
      magdalena().then(() =>{
        saloncantik().then(() =>{
          anitasalon().then(() =>{
            fourlen().then(() => {
              moz5().then(() =>{
                irwansalon().then(() =>{
                  didosalon().then(() => {
                    dianmustika().then(() =>{
                      joanne().then(() =>{
                        poetrespa().then(() => {
                          naomi().then(() => {
                            cbc().then(() => {
                              royalgarden().then(() => {
                                tokyobelle().then(() => {
                                  umandaruspa().then(() => {
                                    natashaskin().then(() => {
                                      estherhouse().then(() => {
                                        console.log("scraping done");
                                        //seeder file
                                        seed().then(() => {
                                          console.log('all seeder done');
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    zanitasalon();
  });

  return cron;
}

module.exports = Job
