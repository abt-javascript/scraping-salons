'use strict';
const controller = require('./controller');

module.exports = [{
	method: 'post',
	path: '/recent',
	options:{
		handler: controller.create,
		description: 'create recent salon by user',
		notes: 'create resent salon',
		tags: ['api']
	}
}];
