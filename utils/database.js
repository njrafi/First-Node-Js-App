const mysql = require("mysql2");

const pool = mysql.createPool({
	host: "localhost",
	user: "node",
	database: "nodejs",
	password: "NodeJs1234"
});

module.exports = pool.promise();
