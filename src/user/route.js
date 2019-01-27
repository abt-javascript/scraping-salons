'use strict';
const controller = require('./controller');
const validation = require('./validation');

module.exports = [{
	method: 'get',
	path: '/',
	handler: controller.home,
	config: {
		auth:false
	}
}, {
	method: 'get',
	path: '/users',
	options: {
		handler: controller.list,
		description: 'List user ',
		notes: 'list all user no need',
		tags: ['api'],
	},
}, {
	method: 'post',
	path: '/user/sign_up',
	options: {
		handler: controller.sign_up,
		description: 'Sign up user ',
		notes: 'Register for new user',
		tags: ['api'],
		auth:false,
		validate: {
			payload: validation.create
		}
	}
}, {
	method: 'post',
	path: '/user/sign_in',
	handler: controller.sign_in,
	options:{
		auth: false,
		description: 'Sign in user ',
		notes: 'sign in user is required for get token',
		tags: ['api'],
		validate: {
			payload: validation.signin
		}
	}
}, {
	method: 'get',
	path: '/user/{id}',
	handler: controller.byId
}];
