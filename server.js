require('./dotenv.js');
const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const authJwt = require('./config/auth-jwt.js');
const routes = require('./config/routes.js')();
const cron = require('./config/cron.js');
const Bcrypt = require('bcrypt');
const views = require('./views.js');

const server = new Hapi.Server({
  port: process.env.PORT || 1200,
  routes: {
      files: {
          relativeTo: Path.join(__dirname, 'public/image')
      }
  }
});

server.register(require('inert'));

const swaggerOptions = {
  info: {
    title: 'Salons Scraping Data API Documentation',
    version: Pack.version,
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

server.register([
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions
  }
]);

const init = async () => {
  await authJwt(server);

  await routes.map((item) => {
    server.route(item);
  });

  await server.register(require('vision'));
  await server.start();

  return server;
}

// run must be after build up
const after_web_up = function(server) {
  // connection to mongo db
  let mongoose = require('./config/connections.js').connection;
  mongoose.on('error', console.error.bind(console, 'connection error:'));
  mongoose.once('open', function() {
      console.log("mongodb ready !");
  });

  // cron job for scarping data
  cron();

  console.log(`Server running at: ${server.info.uri}`)
}


init().then(server => {
    after_web_up (server);
});
