'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/review',
	handler: controller.add
}];
