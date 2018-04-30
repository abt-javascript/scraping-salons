'use strict';
const locationModel = require('./model');
const validateLatLng = require('../../services/validateLatLng');
const axios = require('axios');
const _ = require('lodash');

let salon = {
	upload: async function(request, h) {
		const data = await new Promise((resolve, reject) => {
			locationModel.find().populate('salon').exec((err, result) => {
				if(!err) {
					return resolve(result);
				}

				reject(err);
			});
		});

		return data;
	},
	list: async function(request, h) {
		var data  = await h.file(`${request.params.file}`);
		return data;
	}

};

module.exports = salon;
