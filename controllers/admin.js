const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit; // accessing query parameters
	if (!editMode) {
		res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		if (!product) {
			res.redirect('/');
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(id, title, imageUrl, description, price);
	product.save();
	res.redirect('/admin/products');
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	//const product = new Product(null, title, imageUrl, description, price);
	// product
	// 	.save()
	// 	.then(() => {
	// res.redirect('/');
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});

	//adding product to table using sequalize
	Product.create({
		title: title,
		price: price,
		imageUrl: imageUrl,
		description: description,
	})
		.then((result) => {
			res.redirect('/');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};

exports.postDelete = (req, res, next) => {
	Product.delete(req.body.productId);
	res.redirect('/admin/products');
};
