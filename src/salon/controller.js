'use strict';
const salonModel = require('./model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');
const locationModel = require('../location/model');
const axios = require('axios');

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
		const query = request.query;

		if (query.lat && query.long) {
			const salon =  await new promise(function(resolve, reject) {
				salonModel.findOne({_id:request.params.id}).populate('review').exec((err, result) => {
					if(err) {
						return reject(err);
					}

					locationModel.findOne({
						location: {
							$nearSphere: [parseFloat(query.long), parseFloat(query.lat)],
							$maxDistance: 0.01
						},
						salon:request.params.id
					}).exec((err, res) => {
						if (err) {
							return reject(err);
						}

						if (res) {
							var url =`origins=${query.lat},${query.long}&destinations=${res.location.coordinates[1]},${res.location.coordinates[0]}`

							axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI&${url}`).then((response) => {
								if(response.data.error_message) {
									return reject(response.data.error_message);
								}

								if(response.data.rows[0].elements[0].distance) {
									var distance = response.data.rows[0].elements[0].distance;

									var item = {
    								upload: result.upload,
    								review: result.review,
    								location: res,
    								_id: result._id,
    								name: result.name,
    								__v: result.__v,
    								created:result.created,
	    							baseUrl:result.baseUrl,
	    							images:result.images,
	    							address:result.address,
	    							service: result.service,
										distanceText: distance.text,
										distanceValue:distance.value,
										lat:res.location.coordinates[0],
										long:res.location.coordinates[1],
									};

									resolve(item);
								}
							});
						}
					});
				});
			});

			return salon;
		}

		const data = await new promise((resolve, reject) => {
			salonModel.findOne({_id:request.params.id}).populate('review').exec((err, result) => {
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
