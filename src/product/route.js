'use strict';
const productController = require('./controller');

module.exports = [{
	method: 'GET',
	path: '/product',
	handler: productController.index
}];
