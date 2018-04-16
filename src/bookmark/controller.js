'use strict';
const bookmarkModel = require('./model');

let bookmark = {
	create: async function(request, h) {
		var payload = request.payload;
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
			bookmarkModel.update(createData, createData, {upsert: true}, (err, bookmark) => {
				if(!err) {
					return resolve(bookmark);
				}
console.log(err);

				reject(err);
			});
		});

		return data;
	}

};

module.exports = bookmark;
