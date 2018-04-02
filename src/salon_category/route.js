'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/saloncategory',
	handler: controller.list
}];
