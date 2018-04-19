'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
  salon: { type: Schema.Types.ObjectId, ref: 'Salon' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  created: 'date',
  updated: 'date'
}, {
  collection:'Recent'
});

module.exports = mongoose.model('Recent', schema);
