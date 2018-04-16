'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/bookmark',
	handler: controller.create
}];
