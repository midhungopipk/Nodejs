const Product = require('../model/product');

exports.getAddProduct = (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add Products',
		path: '/admin/add-product',
	});
};

exports.postAddProduct = (req, res, next) => {
	const product = new Product(req.body.title);
	product.save();
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	const products = Product.fetchAll();
	res.render('shop', {
		prods: products,
		pageTitle: 'My Shop',
		path: '/',
	});
};