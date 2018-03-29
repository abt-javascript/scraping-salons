const Joi = require('joi');

const validation = {
  create:{
    fullname: Joi.string().min(3).required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
    mobile: Joi.string().min(10).required()
  },
  signin:{
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).required()
  }
};

module.exports = validation;
