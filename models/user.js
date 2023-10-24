const mongoConnect = require('../util/database');
const mongodb = require('mongodb');
class Users {
	constructor(username, email) {
		this.username = username;
		this.email = email;
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

	static findById(userId) {
		const db = mongoConnect.getDb();
		return db
			.collection('users')
			.find({ _id: new mongodb.ObjectId(userId) })
			.next();
	}
}

module.exports = Users;
