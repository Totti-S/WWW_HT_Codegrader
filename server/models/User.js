const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let usersSchema = new Schema({
	username: String,
	password: String,
	admin: Boolean,
	profile: {
		name: {type: String},
		age: {type: Number},
		gender: {type: String},
		email: {type: String},
		profileImg: {type: String},
		about: {type: String},
		created: {type: Date}
	}
});

module.exports = mongoose.model("Users",usersSchema);
