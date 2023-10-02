const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log(adminData.products);
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
	// res.render('shop', {
	// 	prods: adminData.products,
	// 	pageTitle: 'My Shop',
	// 	path: '/',
	// });
	res.render('shop', {
		prods: adminData.products,
		pageTitle: 'My Shop',
		path: '/',
		hasProducts: adminData.products.length > 0,
		productCSS: true,
		formCss: false,
		activeShop: true,
	});
});

module.exports = router;
