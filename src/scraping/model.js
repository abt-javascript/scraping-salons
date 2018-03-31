'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  name: {
    type:'string',
    unique:true
  },
  images: 'string',
  service: 'string',
  branch: 'string',
  contact: 'string',
  baseUrl: 'string',
  created: 'date',
  updated: 'date'
}, {
  collection:'Scraping'
});

module.exports = mongoose.model('Scraping', schema);
