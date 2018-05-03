'use strict';
const imageModel = require('./model');
const salonModel = require('../salon/model.js');
const validateLatLng = require('../../services/validateLatLng');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

let salon = {
	upload: async function(request, h) {
		var host = request.headers.host;
		var data = request.payload;
		if(!data.salon_id){
			return 'salon id required'
		}

		var data2  = await new Promise((resolve, reject) => {
			if(!data.file){
				return resolve('Empty Data')
			}

			var name = data.file.hapi.filename;
			var path = `public/image/${name}`;
			var file = fs.createWriteStream(path);

			file.on('error', function (err) { 
				reject(err) 
			});
	
			data.file.pipe(file);

			data.file.on('end', function (err) { 
				imageModel.create({salon:data.salon_id, name:`${host}/image/${name}`}, (err, image) => {
					var arr = [];
					arr.push(image)
					
					if(err){
						return reject(err);
					}
					salonModel.update(
						{ _id: data.salon_id }, 
						{ $push: { upload: image } },
						(err, salon) => {
							if(err){
								console.log(err)
								return reject(err);
							}

							var ret = {
								filename: data.file.hapi.filename,
								headers: data.file.hapi.headers
							}
							resolve(ret);
					});
					
				});
			})
		});

		return data2;
	},
	list: async function(request, h) {
		console.log('masuk');
	
		var data  = await h.file(`${request.params.file}`);
		return data;
	}

};

module.exports = salon;
