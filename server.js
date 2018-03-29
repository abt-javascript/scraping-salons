require('./dotenv.js');
const Hapi = require('hapi');
const server = new Hapi.Server();
const authJwt = require('./config/auth-jwt.js');
const routes = require('./config/routes.js')();
const cron = require('./config/cron.js');

//need run after build up
const after_web_up = function() {
    let mongoose = require('./config/connections.js').connection;
    mongoose.on('error', console.error.bind(console, 'connection error:'));
    mongoose.once('open', function() {
        console.log("mongodb ready !");
    });

    cron();
    console.log(`Server running at: ${server.info.uri}`)
}

const init = async () => {
  await authJwt(server);

  await routes.map((item) => {
    server.route(item);
  });

  await server.start();

  return server;
}

init().then(server => {
    after_web_up ();
  }).catch(error => {
    console.log(error);
  });
