'use strict';
const locationModel = require('./model');
const validateLatLng = require('../../services/validateLatLng');
const axios = require('axios');

let salon = {
	list: async function(request, h) {
		const data = await new Promise((resolve, reject) => {
			locationModel.find().populate('salon').exec((err, result) => {
				if(!err) {
					return resolve(result);
				}

				reject(err);
			});
		});

		return data;
	},
	getNearest: async function(request, h) {
		var query = request.query;
		var lat = query.lat;
		var long = query.long;
		if(!lat) {
			return  'Latitude is required'
		}

		if(!long) {
			return  'Longitude is required'
		}

		const data = await new Promise((resolve, reject) => {
			validateLatLng(lat, long).then((validation) => {
				if(!validation.status) {
					return resolve(validation.text);
				}

				locationModel.find().populate('salon').exec((err, result) => {
					if(!err) {
						var arr = [];

						result.map((item, index) => {
							if(item.location){
								var location = JSON.parse(item.location);
								var url =`origins=${lat},${long}&destinations=${location.lat},${location.lng}`

								axios.get(`http://maps.googleapis.com/maps/api/distancematrix/json?${url}`).then((response) => {
									if(response.data.rows[0].elements[0].distance) {
										var distance = response.data.rows[0].elements[0].distance;
										arr.push({text:distance.text, value:distance.value, name:item.salon.name})
									}
							  })
							  .catch(function (error) {
							    console.log(error);
							  });

							}
						});

						Promise.all(arr).then(()=>{
							console.log(arr);
							return resolve(arr)
						})
					}

					//reject(err);
				});

			});
		});

		return data;
	}

};

module.exports = salon;
