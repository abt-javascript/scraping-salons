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
const sortByDistance = require('sort-by-distance')

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
		
		var dataReady = [];

		Promise.each = async function(arr, fn) {
			for(const item of arr) {
			  const locData = await fn(item);
	   
			  //collect address to db
			  dataReady.push(locData);
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
								var obj = {
									images:item.images,
									baseUrl:item.baseUrl,
									location:res.location,
									address:res.address,
									name:item.name,
									distanceText:distance.text,
									distanceValue:distance.value,
									service:item.service,
									contact:item.contact
								}

								resolve(obj);

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
			salonModel.find().exec((err, salons)=> {
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

			categoryModel.find().populate('salons').exec((err, categori) => {
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
