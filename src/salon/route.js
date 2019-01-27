'use strict';

const controller = require('./controller');
const validation = require('./validation');

module.exports = [{
	method: 'get',
	path: '/salon',
	handler: controller.list,
	options:{
		description: "list all salons",
		notes: "list all salons",
		tags: ["api"]
	}
}, {
	method: 'get',
	path: '/salon/{id}',
	handler: controller.byId,
	options:{
		description: "list all salon by id",
		notes: "list salons",
		tags: ["api"],
		validate: {
			params: validation.byid
		}
	}
}];
