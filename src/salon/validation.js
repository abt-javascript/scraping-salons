const Joi = require('joi');

const validation = {
  byid:{
    id: Joi.string().min(3).required()
  }
};

module.exports = validation;
