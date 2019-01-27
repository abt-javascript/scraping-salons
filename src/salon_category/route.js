'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'get',
	path: '/saloncategory',
	options: {
		handler: controller.list,
		description: 'List Salon Category',
		notes: 'List Salon Category',
		tags: ['api'],
	}
}];
