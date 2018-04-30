'use strict';

const mongoose = require("./../../config/connections");
require('mongoose-double')(mongoose);

let Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

let schema = new Schema({
  salon:  { type: Schema.Types.ObjectId, ref: 'Salon' },
  name: 'string',
  created: 'date',
  updated: 'date'
}, {
  collection:'Image'
});

module.exports = mongoose.model('Image', schema);
