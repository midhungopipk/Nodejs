const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../util/path');
const products = [];
//This is actually /admin/add-products => GET
router.get('/add-product', (req, res, next) => {
	//res.sendFile(path.join(__dirname, '../','views', 'add-product.html'));
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

	res.render('add-product', { docTitle: 'Add Products' });
});

//This is actually /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
	console.log(req.body);
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;
