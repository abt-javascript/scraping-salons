'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/location',
	handler: controller.list
}];
