const Joi = require('joi');

const validation = {
  create:{
    fullname: Joi.string().min(3).required(),
    username: Joi.string().email(),
    password: Joi.string().min(3).required(),
    mobile: Joi.string().min(10)
  },
  signin:{
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required()
  }
};

module.exports = validation;
