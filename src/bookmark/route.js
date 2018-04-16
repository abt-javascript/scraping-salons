'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/bookmark',
	handler: controller.create
}];
