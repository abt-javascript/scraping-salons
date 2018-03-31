'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  name: {
    type:'string',
    unique:true
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Category'
});

module.exports = mongoose.model('Category', schema);
