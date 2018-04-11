'use strict';
const salonModel = require('./model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');
const locationModel = require('../location/model');

let salon = {
	list: async function(request, h) {
		const data = await new promise((resolve, reject) => {
			salonModel.find().populate('branch').exec((err, result) => {
				if(!err) {
					return resolve(result);
				}

				reject(err);
			});
		});

		return data;
	},
	byId: async function(request, h) {
		const data = await new promise((resolve, reject) => {
			salonModel.findOne({_id:request.params.id}).exec((err, result) => {
				if(!err) {
					locationModel.find({salon:request.params.id}).exec((err, loc) => {
						if(loc.length > 0) {
							result.branch = loc;

							return resolve(result);
						}
						else{
							reject('EMPTY');
						}
					})

				}

				if(err) {
					reject(err);
				}

			});
		});

		return data;
	}
};

module.exports = salon;
