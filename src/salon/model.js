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
  upload: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  location: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  contact: 'string',
  phone: 'string',
  baseUrl: 'string',
  created: 'date',
  updated: 'date'
}, {
  collection:'Salon'
});

module.exports = mongoose.model('Salon', schema);
