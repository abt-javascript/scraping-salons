'use strict';

const mongoose = require("./../../config/connections");
require('mongoose-double')(mongoose);

let Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

let schema = new Schema({
  salon:  { type: Schema.Types.ObjectId, ref: 'Salon' },
  address: 'string',
  location: {
    type: { type: String },
    coordinates: [ ] 
  },
  loc_string: {
    type:'string'
  },
  created: 'date',
  updated: 'date'
}, {
  collection:'Location'
});

schema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', schema);
