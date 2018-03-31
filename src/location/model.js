'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  salon: 'string',
  address: 'string',
  location: {
    type:'string',
    unique:true
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Location'
});

module.exports = mongoose.model('Location', schema);
