'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  salon:  { type: Schema.Types.ObjectId, ref: 'Salon' },
  address: 'string',
  location: {
    type:'string',
    unique:true
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Bookmark'
});

module.exports = mongoose.model('Bookmark', schema);
