'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/salon',
	handler: controller.list
}];
