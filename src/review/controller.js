'use strict';
const reviewModel = require('./model');
const salonModel = require('../salon/model.js');

let review = {
	add: async function(request, h) {
		var data = request.payload;
		if(!data.salon_id){
			return 'salon id required'
		}
		
		if(!data.user_id){
			return 'user id required'
		}

		var obj = {
			salon:data.salon_id,
			user:data.user_id,
			star:data.star,
			text:data.comment
		}
		var data2  = await new Promise((resolve, reject) => {
			reviewModel.create(obj, (err, review) => {
				if(err){
					return reject(err)
				}
				salonModel.update(
					{ _id: data.salon_id }, 
					{ $push: { review: review } },
					(err, salon) => {
						if(err){
							console.log(err)
							return reject(err);
						}

						resolve(review);
				});
			});
		});

		return data2;
	}
};

module.exports = review;
