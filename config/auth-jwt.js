'use strict';

const promise = require('bluebird');
const hapiAuthJwt = require('hapi-auth-jwt2');
const userModel = require('../src/user/model');
const moment = require('moment');

const validate = async function(decode, request) {
  if(moment().unix() > decode.expire){
    return {isValid:false, response:'session expire'}
  }

  const status = await new promise((resolve, reject) => {
    userModel.findOne({username:decode.username, mobile:decode.mobile}, (err, user) => {
      if(err) {
        resolve({isValid:false});
      }

      if(!user) {
        resolve({isValid:false});
      }

      resolve({isValid:true});
    });
  });

  return status
}

const authJwt  = async function authJwtConfig (server) {
  await server.register(hapiAuthJwt);

  await server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET,
    validate: validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

  server.auth.default('jwt');

  return server;
}

module.exports = authJwt
