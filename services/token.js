'use strict';

const JWT   = require('jsonwebtoken');
const moment = require('moment');

const token = function (obj) {
  let plus3Hours = moment().hour(moment().hour() + 3);
  obj['create'] = moment(moment(), "D/M/YYYY  HH:mm:dd").unix();
  obj['expire'] = moment(plus3Hours, "D/M/YYYY  HH:mm:dd").unix();

  const encode =  JWT.sign(obj, `${process.env.SECRET}`);
  
  return encode;
}

module.exports = token;
