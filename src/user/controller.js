'use strict';
const userModel = require('./model');
const bookmarkModel = require('../bookmark/model.js');
const recentModel = require('../recent/model.js');
const promise = require('bluebird');
const generateToken = require('../../services/token.js');
const signin = require('../../services/sign-in.js');
const generateHash = require('../../services/hash.js');

let user = {
	home: async function(request, h) {
		return h.view('index');
	},
	list: async function(request, h) {
		const user = await new promise((resolve, reject) => {
			userModel.find().select("-password").exec((err, users) => {
				if(!err){
					resolve(users);
				}

				reject(err);
			});
		});

		return user;
	},
	sign_up: async function(req, h) {
		let payload = req.payload;
		payload.created = new Date();
console.log(payload);
		let createUser =  await new promise((resolve, reject) => {
			generateHash(payload.password).then(hash => {
				payload.password = hash;

				userModel.create(payload, (err, ok) => {
					if(!err) {
						resolve(ok);
					}


					if(err && err.code === 11000){
						resolve('duplicate payload');
					}

					reject(err);
				});
			}).catch(err => {
				reject(err)
			});
		});

		return h.response(createUser);
	},
	sign_in: async function(req, h) {
		let payload = req.payload;

		let user =  await new promise((resolve, reject) => {
			userModel.findOne({username:payload.username}, (err, ok) => {
				if(err) {
					reject(err);
				}

				if(!ok) {
					reject('Data not match');
				}

				if(ok) {
					signin(payload.password, ok).then(signin => {
						if(!signin){
							resolve("Username Or password dont match");
						}

						let obj = {
							_id: ok._id,
							username: ok.username,
							fullname: ok.fullname,
							mobile: ok.mobile,
							success:true,
							message: 'Success'
						};

						bookmarkModel.find({user:ok._id}).populate('salon').exec((err, bookmark) => {
							if(!err) {
								obj['bookmark'] = bookmark;
								obj['token'] = generateToken(obj);

								recentModel.find({user:ok._id}).populate('salon').exec((err2, recent) => {
									if(!err2){
										obj['recent'] = recent;
										return resolve(obj);
									}
									console.log(err)
								});
							}
							else {
								reject(err);
							}
						});

					}).catch(err => {
						reject(err);
					});
				}
			});
		});

		return h.response(user);
	},
	byId: async function(request, h) {
		const data = await new promise((resolve, reject) => {
			userModel.findOne({_id:request.params.id},{password:0}).exec((err, result) => {
				if(!err) {
					resolve(result);
				}

				if(err) {
					reject(err);
				}

			});
		});

		return data;
	}
};

module.exports = user;
