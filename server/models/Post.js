const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let postSchema = new Schema({
	username: String,
	title: String,
	time: Date,
	likes: {
		type: Map,
		of: Boolean
	},
	codeType: String,
	post: String,
	count: Number,
	editTime: Date,
	edited: Boolean
});

module.exports = mongoose.model("Post",postSchema);