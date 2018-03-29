'use strict';

let mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

module.exports = mongoose;
