const path = require('path');
const fs = require('fs');

const p = path.join(
	path.dirname(require.main.filename),
	'data',
	'products.json',
);

const getAllProducts = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (!err) {
			return cb(JSON.parse(fileContent));
		} else {
			return cb([]);
		}
	});
};
module.exports = class Product {
	constructor(t) {
		this.title = t;
	}

	save() {
		getAllProducts((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getAllProducts(cb);
	}
};
