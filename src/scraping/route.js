'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/scraping',
	handler: controller.list
}];
