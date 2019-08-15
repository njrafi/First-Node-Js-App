const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("nodejs", "node", "NodeJs1234", {
	dialect: "mysql",
	host: "localhost"
});

module.exports = sequelize
