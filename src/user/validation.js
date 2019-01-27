const Joi = require('joi');

const validation = {
  create:{
    fullname: Joi.string().min(3).required(),
    email: Joi.string().email().required().description('user name is email'),
    password: Joi.string().min(3).required(),
    mobile: Joi.string()
  },
  signin:{
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
  }
};

module.exports = validation;
