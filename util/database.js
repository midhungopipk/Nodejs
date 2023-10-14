const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://midhungopipk:TXQ6BgreLHJyH2kb@cluster0.jy6ss0v.mongodb.net/shop?retryWrites=true&w=majority',
	)
		.then((client) => {
			console.log('connected');
			_db = client.db();
			callback();
		})
		.catch((error) => {
			console.log(error);
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No db found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
