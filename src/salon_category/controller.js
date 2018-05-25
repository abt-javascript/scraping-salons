'use strict';
const salonCategoryModel = require('./model');
const salonModel = require('../salon/model.js');
const locationModel = require('../location/model');
const categoryModel = require('../category/model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');
const axios = require('axios');
const _ = require('lodash');
const listSalon = require('./controller.list');

let salon = {
	list: async function(request, h) {
		console.log('start',new Date())
		var query = request.query;
		var lat = query.lat;
		var long = query.long;

		var withOutLatLong =  await new Promise((resolve, reject) => {
			listSalon(request, h).then((data) => {
			 return resolve(data)
			});
		});

		if(!lat ||  !long) {
			return withOutLatLong;
		}

		if (parseInt(lat) < -90 || parseInt(lat) > 90) {
			return "Latitude must be between -90 and 90 degrees inclusive.";
		}
		
		if (parseInt(long) < -180 || parseInt(long) > 180) {
			return "Longitude must be between -180 and 180 degrees inclusive.";
		}

		var dataReady = [];

		Promise.each = async function(arr, fn) {
			for(var item of arr) {
			  var locData = await fn(item);
			  var obj = locData._doc;

			  obj.distanceText = locData.distanceText;
			  obj.distanceValue = locData.distanceValue;
			  obj.lat = locData.lat;
			  obj.long = locData.long;

			  dataReady.push(obj);
			}
		 }
	   
		function fn(item) {
			return new Promise((resolve, reject) => {				
				locationModel.findOne({
					location: { 
						$nearSphere: [parseFloat(long), parseFloat(lat)], 
						$maxDistance: 0.01
					},
					salon:item._id
				}).exec((err, res) => {
					if(err){
						console.log(err)
						reject(err);
					}

					if(res){
						var url =`origins=${lat},${long}&destinations=${res.location.coordinates[1]},${res.location.coordinates[0]}`

						axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI&${url}`).then((response) => {
							if(response.data.error_message){
								return reject2(response.data.error_message);
							}

							if(response.data.rows[0].elements[0].distance) {
								var distance = response.data.rows[0].elements[0].distance;
								
								item['distanceText'] = distance.text;
								item['distanceValue'] = distance.value;
								item['lat'] = res.location.coordinates[0];
								item['long'] = res.location.coordinates[1];
								item.address = res.address

								resolve({...item});

							}
							else{
								resolve(false)
							}
						})
						.catch(function (error) {
							reject(error);
						});
					}
					else {
						resolve('Location Data');
					}
				});
			});
		}

		var data_salon = await new Promise((resolve, reject) => {
			salonModel.find().populate({path:'review', populate:{path:'user', select:{password:0}}}).exec((err, salons)=> {
				if(err){
					return reject(err);
				}

				Promise.each(salons, fn).then(() => {
					console.log('end',new Date())
					return resolve(dataReady)
				});
			});
		})
		
		data_salon = _.sortBy(data_salon, 'distanceValue' );

		var data = await new Promise((resolve, reject) => {
			var arr_data = [];

			Promise.each2 = async function(arr, fn2) {
				for(var item of arr) {
					const dataItem = await fn2(item);

					arr_data.push(dataItem);
				}
			}
			var i = 0;
			function fn2(item) {
				var obj = {
					_id:item._id,
					name:item.name,
					salons:data_salon
				}
				
				return obj;
			}

			categoryModel.find().exec((err, categori) => {
				if(err){
					return reject(err)
				}
				if(categori.length === 0){
					return resolve('EMPTY DATA')
				}
				
				Promise.each2(categori, fn2).then(() => {
					resolve(arr_data);
				});
			});
		});

		return data;
	}
};

module.exports = salon;
