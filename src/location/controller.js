'use strict';
const locationModel = require('./model');

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
	}
	
};

module.exports = salon;
