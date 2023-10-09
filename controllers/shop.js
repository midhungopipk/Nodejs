const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
	// Product.fetchAll() //data coming from db
	// 	.then(([rows, fieldData]) => {
	// 		res.render('shop/product-list', {
	// 			prods: rows,
	// 			pageTitle: 'All Products',
	// 			path: '/products',
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});

	//fetching all data from product table Using sequalize
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(([product]) => {
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product[0].title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	// Product.fetchAll() //data coming from db
	// 	.then(([rows, fieldData]) => {
	// res.render('shop/index', {
	// 	prods: rows,
	// 	pageTitle: 'Shop',
	// 	path: '/',
	// });
	// })
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});

	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	Cart.getProducts((cartItem) => {
		if (cartItem) {
			Product.fetchAll((products) => {
				let cartProducts = [];
				for (let product of products) {
					const cartProductData = cartItem.products.find(
						(p) => p.id === product.id,
					);
					if (cartProductData) {
						cartProducts.push({
							productData: product,
							qty: cartProductData.qty,
						});
					}
				}
				res.render('shop/cart', {
					path: '/cart',
					pageTitle: 'Your Cart',
					products: cartProducts,
				});
			});
		} else {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: [],
			});
		}
	});
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;

	Product.findById(productId, (product) => {
		Cart.addProduct(product.id, product.price);
	});

	res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};

exports.postDeleteCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	});
};
