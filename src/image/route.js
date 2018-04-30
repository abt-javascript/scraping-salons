'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/image',
	handler: controller.upload,
	config: {
		payload: {
			output: 'stream',
			allow: 'multipart/form-data'
		}
	}
}];
