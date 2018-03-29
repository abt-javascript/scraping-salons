'use strict';
const scrapingModel = require('./model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');

let scraping = {
	list: async function(request, h) {
		const data = await new promise((resolve, reject) => {
			scrapingModel.find().exec((err, result) => {
				if(!err){
					resolve(result);
				}

				reject(err);
			});
		});

		return data;
	}
};

module.exports = scraping;
