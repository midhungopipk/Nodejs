const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callBack) => {
	MongoClient.connect(
		'mongodb+srv://midhungopipk:TXQ6BgreLHJyH2kb@cluster0.jy6ss0v.mongodb.net/?retryWrites=true&w=majority',
	)
		.then((result) => {
			console.log('connected');
			callBack(result);
		})
		.catch((error) => {
			console.log(error);
		});
};

module.exports = mongoConnect;
