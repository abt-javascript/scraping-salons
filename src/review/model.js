'use strict';

const mongoose = require("./../../config/connections");
require('mongoose-double')(mongoose);

let Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

let schema = new Schema({
  salon:  { type: Schema.Types.ObjectId, ref: 'Salon' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  text: 'string',
  star: {
    type: 'number',
    enum: [1,2,3,4,5]
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Review'
});

module.exports = mongoose.model('Review', schema);
