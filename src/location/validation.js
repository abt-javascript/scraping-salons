const Joi = require('joi');

const validation = {
  getnearest:{
    long: Joi.number().precision(8).description('longitude current location'),
    lat: Joi.number().precision(8).description('latitude current location')
  }
};

module.exports = validation;
