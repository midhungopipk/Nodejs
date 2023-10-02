const express = require('express');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log(adminData.products);
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
