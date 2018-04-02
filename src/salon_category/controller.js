'use strict';
const salonCategoryModel = require('./model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');

let salon = {
	list: async function(request, h) {
		const data = await new promise((resolve, reject) => {
			salonCategoryModel.find().populate('salon').populate('category').exec((err, result) => {
				if(!err) {
					return resolve(result);
				}

				reject(err);
			});
		});

		return data;
	}
};

module.exports = salon;
