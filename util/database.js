// const mysql = require('mysql2');

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	database: 'node-complete',
// 	password: 'softwareassociates',
// });

// module.exports = pool.promise();

//when using sequelize to everything above will done behind the scenes

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'softwareassociates', {
	dialect: 'mysql',
	host: 'localhost',
});

module.exports = sequelize;
