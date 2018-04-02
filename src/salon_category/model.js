'use strict';

const mongoose = require("./../../config/connections");

let Schema = mongoose.Schema;

let schema = new Schema({
    salon : { type: Schema.Types.ObjectId, ref: 'Salon' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    created: 'date',
    updated: 'date'
}, {
  collection:'SalonCategory'
});

module.exports = mongoose.model('SalonCategory', schema);
