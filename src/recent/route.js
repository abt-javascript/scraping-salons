'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/recent',
	handler: controller.create
}];
