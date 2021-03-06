'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  fullname: 'string',
  email: {
    type:'string',
    unique:true
  },
  password: {type:'string'},
  label:'string',
  mobile: 'string',
  created: 'date',
  updated: 'date'
}, {
  collection:'User'
});

module.exports = mongoose.model('User', schema);
