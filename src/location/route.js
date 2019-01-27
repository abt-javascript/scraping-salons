'use strict';

const controller = require('./controller');
const validation = require('./validation');

module.exports = [{
	method: 'get',
	path: '/location',
	options: {
		handler: controller.list,
		description: 'list all location salons',
		notes: 'location salons',
		tags: ['api']
	}
}, {
	method: 'get',
	path: '/getnearest',
	options: {
		handler: controller.getNearest,
		description: "get salons nearest location",
		notes: "lat long require",
		tags: ['api'],
		validate: {
			query: validation.getnearest
		}
	}
}];
