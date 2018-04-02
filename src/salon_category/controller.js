'use strict';
const salonCategoryModel = require('./model');
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
		   return new Promise((resolve, reject) => {
				salonCategoryModel.find({category:item._id}).populate('salon').populate('category').exec((err, result) => {
					if(!err) {
						resolve({category:item.name, data:result})
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

		return data;
	}
};

module.exports = salon;
