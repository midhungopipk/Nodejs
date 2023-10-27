const mongoConnect = require('../util/database');
const mongodb = require('mongodb');
class Users {
	constructor(username, email, cart, id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	save() {
		const db = mongoConnect.getDb();
		return db
			.collection('users')
			.insertOne(this)
			.then((result) => {
				console.log('userCreated');
			})
			.catch((error) => {
				console.log(error);
			});
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() == product._id.toString();
		});

		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: new mongodb.ObjectId(product._id),
				quantity: newQuantity,
			});
		}

		const updatedCart = {
			items: updatedCartItems,
		};

		const db = mongoConnect.getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new mongodb.ObjectId(this._id) },
				{ $set: { cart: updatedCart } },
			);
	}

	getCart() {
		const db = mongoConnect.getDb();
		const productsIds = this.cart.items.map((prod) => {
			return prod.productId;
		});
		return db
			.collection('products')
			.find({ _id: { $in: productsIds } })
			.toArray()
			.then((products) => {
				return products.map((product) => {
					return {
						...product,
						quantity: this.cart.items.find((i) => {
							return i.productId.toString() == product._id.toString();
						}).quantity,
					};
				});
			});
	}

	deleteItemFromCart(prodId) {
		const updatedCartItems = this.cart.items.filter(
			(prod) => prod.productId.toString() !== prodId.toString(),
		);
		const db = mongoConnect.getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new mongodb.ObjectId(this._id) },
				{ $set: { cart: { items: updatedCartItems } } },
			);
	}

	addOrder() {
		const db = mongoConnect.getDb();
		return this.getCart()
			.then((products) => {
				const order = {
					items: products,
					user: {
						_id: new mongodb.ObjectId(this._id),
						username: this.username,
						email: this.email,
					},
				};
				return db.collection('orders').insertOne(order);
			})
			.then(() => {
				return db.collection('users').updateOne(
					{ _id: new mongodb.ObjectId(this._id) },
					{
						$set: { cart: { items: [] } },
					},
				);
			});
	}

	getOrders() {
		const db = mongoConnect.getDb();
		return db
			.collection('orders')
			.find({ 'user._id': new mongodb.ObjectId(this._id) })
			.toArray();
	}

	static findById(userId) {
		const db = mongoConnect.getDb();
		return db
			.collection('users')
			.find({ _id: new mongodb.ObjectId(userId) })
			.next();
	}
}

module.exports = Users;
