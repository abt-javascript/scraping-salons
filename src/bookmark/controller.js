'use strict';
const bookmarkModel = require('./model');

let bookmark = {
	list: async function(request, h) {
		const data = await new Promise((resolve, reject) => {
			bookmarkModel.find().populate('salon').exec((err, result) => {
				if(!err) {
					return resolve(result);
				}

				reject(err);
			});
		});

		return data;
	}

};

module.exports = bookmark;
