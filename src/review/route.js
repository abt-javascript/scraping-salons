'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/review',
	options: {
		handler: controller.add,
		description: "create review user to each salon",
		notes: "this api review for each salon by user",
		tags: ["api"]
	}
}];
