'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  salon:  { type: Schema.Types.ObjectId, ref: 'Salon' },
  address: 'string',
  location: {
    type:'string'
  },
  lat: {
    type:'string'
  },
  long: {
    type:'string'
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Location'
});

module.exports = mongoose.model('Location', schema);
