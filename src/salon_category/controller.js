'use strict';
const salonCategoryModel = require('./model');
const locationModel = require('../location/model');
const category = require('../category/model');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');

let salon = {
	list: async function(request, h) {
		let catArr = [];
		Promise.each = async function(arr, fn) {
			for(const item of arr) {
			  const catSal = await fn(item);

			  //collect address to db
			  catArr.push(catSal);
			}
		}

		function fn(item) {
			var arr = [];
			Promise.each2 = async function(arr, fn2) {
				for(const item of arr) {
					const catSal = await fn2(item);
					arr.push(catSal)
				}
			}

			function fn2(item) {
				return new Promise((resolve, reject) => {
					Promise.each3 = async function(arr, fn2) {
						for(const item of arr) {
							const catSal = await fn2(item);
							arr.push(catSal)
						}
					}

					function fn3(item) {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(item)
							},10)
						})
					}

					locationModel.find({salon:item.salon._id}).exec((err, loc)=> {
						if(!err) {
							Promise.each3(loc, fn3).then(() => {
								item.salon.branch=loc;
								resolve(item)
							});
						}

						return reject(err);
					});
				});

			}

	   return new Promise((resolve, reject) => {
			salonCategoryModel.find({category:item._id}).populate('salon').exec((err, result) => {
				if(!err) {
					if(result.length > 0) {
						Promise.each2(result, fn2).then(() => {
							resolve({category:item.name, data:result})
						});
					}
				}
			});
	   });
		}

		const data = await new promise((resolve, reject) => {
			category.find().exec((err, category) => {
				if(category.length > 0) {
					Promise.each(category, fn).then(() =>{
						resolve(catArr);
					});
				}
			});
		});

		// var abc = data[0].data;
		// abc.map((item) => {
		// 	console.log('id salon', item.salon._id, 'salon category id', item.id, 'category_id', item.category);
		// });

		return data;
	}
};

module.exports = salon;
