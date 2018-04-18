'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/location',
	handler: controller.list
}, {
	method: 'get',
	path: '/getnearest',
	handler: controller.getNearest
}];
