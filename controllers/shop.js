const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');

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
	Product.findAll({ where: { userId: req.user.id } })
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Shop',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(err);
		});

	console.log(Object.keys(Product.__proto__));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	// both method does the same
	Product.findAll({ where: { id: prodId } })
		.then((product) => {
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product[0].title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(err);
		});
	// Product.findByPk(prodId)
	// 	.then((product) => {
	// 		res.render('shop/product-detail', {
	// 			product: product,
	// 			pageTitle: product.title,
	// 			path: '/products',
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
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

	Product.findAll({ where: { userId: req.user.id } })
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
	// Cart.findAll({ where: { userId: req.user.id } })
	// 	.then((cart) => {})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});

	req.user
		.getCart()
		.then((cart) => {
			cart.getProducts().then((products) => {
				res.render('shop/cart', {
					path: '/cart',
					pageTitle: 'Your Cart',
					products: products,
				});
			});
		})
		.catch((err) => {
			console.log(err);
		});

	// Cart.getProducts((cartItem) => {
	// 	if (cartItem) {
	// 		Product.fetchAll((products) => {
	// 			let cartProducts = [];
	// 			for (let product of products) {
	// 				const cartProductData = cartItem.products.find(
	// 					(p) => p.id === product.id,
	// 				);
	// 				if (cartProductData) {
	// 					cartProducts.push({
	// 						productData: product,
	// 						qty: cartProductData.qty,
	// 					});
	// 				}
	// 			}
	// res.render('shop/cart', {
	// 	path: '/cart',
	// 	pageTitle: 'Your Cart',
	// 	products: cartProducts,
	// });
	// 		});
	// 	} else {
	// 		res.render('shop/cart', {
	// 			path: '/cart',
	// 			pageTitle: 'Your Cart',
	// 			products: [],
	// 		});
	// 	}
	// });
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}

			if (product) {
				const oldQuantity = product.cartItem.quantity;
				newQuantity = oldQuantity + 1;
				return product;
			}
			return Product.findByPk(prodId);
		})
		.then((product) => {
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));

	// Product.findById(productId, (product) => {
	// 	Cart.addProduct(product.id, product.price);
	// });

	// res.redirect('/cart');
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			return req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						}),
					);
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.then((result) => {
			return fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ['products'] })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			console.log(err);
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

	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			const product = products[0];
			return product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {});
	// Product.findById(prodId, (product) => {
	// 	Cart.deleteProduct(prodId, product.price);
	// res.redirect('/cart');
	// });
};
