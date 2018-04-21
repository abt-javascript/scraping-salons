'use strict';
const locationModel = require('./model');
const validateLatLng = require('../../services/validateLatLng');
const axios = require('axios');
const _ = require('lodash');

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
					if(err) {
						return reject(err);
					}

					resolve(result);

				});

			});
		});

		var arr  = [];
	 	Promise.each = async function(array, fn) {
			for(const item of array) {
				var data = await fn(item);

				if(data) {
					arr.push(data);
				}
			}
		}

		function looping(item) {
			return new Promise((resolve2, reject2) => {
				if(item.location) {
					var location = JSON.parse(item.location);
					var url =`origins=${lat},${long}&destinations=${location.lat},${location.lng}`

					axios.get(`http://maps.googleapis.com/maps/api/distancematrix/json?${url}`).then((response) => {
						if(response.data.error_message){
							return reject2(response.data.error_message);
						}

						if(response.data.rows[0].elements[0].distance) {
							var distance = response.data.rows[0].elements[0].distance;
							resolve2({text:distance.text, value:distance.value, address:item.address, salon:item.salon, salon_id:(item.salon) ? item.salon._id : item.salon})
						}
						else{
							resolve2(false)
						}
					})
					.catch(function (error) {
						reject2(error);
					});

				}
				else {
					resolve2(false)
				}
			});
		}

		var data2 = await new Promise((resolve3, reject3) =>{
			Promise.each(data, looping).then(() => {
				resolve3(arr);
			})
		})
		var data2 = _.sortBy(data2, 'value' );
		var data3 = _.values(_.groupBy(data2, 'salon_id'));

		data3.map((item) => {
			if(item[0].salon && item[0].salon_id){
				console.log(item[0].salon_id, item[0].salon.name);
			}
			else {
				console.log('ini yg undef',item[0]);
			}

		});

		return data3;
	}

};

module.exports = salon;
