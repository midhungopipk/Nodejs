const mongoConnect = require('../util/database');
const mongodb = require('mongodb');
class Product {
	constructor(title, price, description, imageUrl, _id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = _id ? new mongodb.ObjectId(_id) : null;
		this.userId = userId;
	}

	save() {
		const db = mongoConnect.getDb();
		let dbOp;
		if (this._id) {
			dbOp = db
				.collection('products')
				.updateOne({ _id: this._id }, { $set: this }); //or dbOp=db.collection('products').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{title:this.title,price:this.price,description:this.description,imageUrl:this.imageUrl}})
		} else {
			dbOp = db.collection('products').insertOne(this);
		}

		return dbOp
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static fetchAll() {
		//find may return millions of documents...in that case a pagination would be a better choice.
		const db = mongoConnect.getDb();

		return db
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				console.log(products);
				return products;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static findById(prodId) {
		const db = mongoConnect.getDb();
		return db
			.collection('products')
			.find({ _id: new mongodb.ObjectId(prodId) }) //mongo db stores id like this Object('id')
			.next()
			.then((product) => {
				console.log(product);
				return product;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	static deleteById(prodId) {
		const db = mongoConnect.getDb();
		return db
			.collection('products')
			.deleteOne({ _id: new mongodb.ObjectId(prodId) })
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

module.exports = Product;
