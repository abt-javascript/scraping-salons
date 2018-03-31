'use strict';

const mongoose = require("./connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  name: {
    type:'string',
    unique:true
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Seeder'
});

module.exports = mongoose.model('Seeder', schema);
