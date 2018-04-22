'use strict';
const salonCategoryModel = require('./model');
const salonModel = require('../salon/model.js');
const locationModel = require('../location/model');
const category = require('../category/model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');
const axios = require('axios');
const _ = require('lodash');
const listSalon = require('./controller.list');

let salon = {
	list: async function(request, h) {
		console.log('start', new Date());
		var query = request.query;
		var lat = query.lat;
		var long = query.long;

		if(!lat ||  !long) {
			var withOutLatLong =  await new Promise((resolve, reject) => {
				listSalon(request, h).then((data) => {
				 return resolve(data)
				});
			});

			return withOutLatLong;
		}

		var data = await new Promise((resolve, reject) => {
			salonModel.find().populate('branch').exec((err, salons)=>{
				if(!err) {
					return resolve(salons)
				}

			reject(err);
			});
		})

		return data;
	},
	list2: async function(request, h) {
		console.log('start', new Date());
		var query = request.query;
		var lat = query.lat;
		var long = query.long;

		if(!lat ||  !long) {
			var abc =  await new Promise((resolve, reject) => {
				listSalon(request, h).then((data) => {
				 return resolve(data)
				});
			});

			return abc;
		}

		const data = await new Promise((resolve, reject) => {
			locationModel.find().populate('salon').exec((err, result) => {
				if(err) {
					return reject(err);
				}

				resolve(result);

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

					axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI&${url}`).then((response) => {
						if(response.data.error_message){
							return reject2(response.data.error_message);
						}

						if(response.data.rows[0].elements[0].distance) {
							var distance = response.data.rows[0].elements[0].distance;
							salonCategoryModel.find({salon:item.salon._id}).populate('category').exec((err, salcat) =>{
								if(salcat.length > 0) {
									var final = {text:distance.text, salcat:salcat, value:distance.value, address:item.address, salon:item.salon, salon_id:(item.salon) ? item.salon._id : item.salon};
									return resolve2(final)
								}

								resolve2({text:distance.text, value:distance.value, address:item.address, salon:item.salon, salon_id:(item.salon) ? item.salon._id : item.salon})
							});

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
		});
		var data2 = _.sortBy(data2, 'value' );

		var data3 = _.values(_.groupBy(data2, 'salon_id'));

		var data4 = [];

		data3.map((item) => {
			if(item[0].salon && item[0].salon_id){
				data4.push(item[0]);
			}
			else {
				console.log('ini yg undef',item[0]);
			}

		});
		console.log('end', new Date());
		return data4;
	}
};

module.exports = salon;
