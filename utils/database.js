const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
	MongoClient.connect(
		"mongodb+srv://njrafi:NodeJs1234@nodejscluster-zwpxh.mongodb.net/test?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
		.then(client => {
			console.log("connected to mongoDb Database");
			callback(client);
		})
		.catch(err => console.log(err));
};

module.exports = mongoConnect;
