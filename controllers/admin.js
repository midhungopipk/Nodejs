const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		//dont confuse for editing and adding same route is used here
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit; // accessing query parameters url...?edit=true
	if (!editMode) {
		res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((products) => {
			const product = products;
			if (!product) {
				res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product(title, price, description, imageUrl, id);

	product
		.save()
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product(
		title,
		price,
		description,
		imageUrl,
		null,
		req.user._id,
	);

	product
		.save()
		.then((result) => {
			console.log('created product.');
			res.redirect('/');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postDelete = (req, res, next) => {
	const prodId = req.body.productId;

	Product.deleteById(prodId)
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((error) => {
			console.log(error);
		});
};
