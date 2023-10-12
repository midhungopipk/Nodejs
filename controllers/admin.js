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
	Product.findAll({ where: { id: prodId, userId: req.user.id } })
		.then((products) => {
			const product = products[0];
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
	// const product = new Product(id, title, imageUrl, description, price);
	//product.save();
	Product.findByPk(id)
		.then((product) => {
			product.title = title;
			product.imageUrl = imageUrl;
			product.price = price;
			product.description = description;
			return product.save(); //.save is from sequalize
		})
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
	//adding product to table using sequalize
	Product.create({
		title: title,
		price: price,
		imageUrl: imageUrl,
		description: description,
		userId: req.user.id, //we have made a relation check app.js
	})
		.then((result) => {
			res.redirect('/');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	// Product.findAll(([products]) => {
	// res.render('admin/products', {
	// 	prods: products,
	// 	pageTitle: 'Admin Products',
	// 	path: '/admin/products',
	// });
	// });
	Product.findAll({ where: { userId: req.user.id } })
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
	// Product.delete(req.body.productId);
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((error) => {
			console.log(error);
		});
};
