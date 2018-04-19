'use strict';
const recentModel = require('./model');

let recent = {
	create: async function(request, h) {
		var payload = request.payload;

		if(!payload) {
			return 'user_id and salon_id required'
		}

		if(!payload.user_id) {
			return 'Missing user_id'
		}

		if(!payload.salon_id) {
			return 'Missing salon_id'
		}

		var createData = {
			salon:payload.salon_id,
			user:payload.user_id
		}

		const data = await new Promise((resolve, reject) => {
			recentModel.update(createData, createData, {upsert: true}, (err, bookmark) => {
				if(!err) {
					return resolve(bookmark);
				}

				reject(err);
			});
		});

		return data;
	}

};

module.exports = recent;
