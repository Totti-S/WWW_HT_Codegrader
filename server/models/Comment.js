const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let commentSchema = new Schema({
	username: String,
	time: Date,
	comment: String,
	likes: {
		type: Map,
		of: Boolean
	},
	count: Number,
	postId: String,
	editTime: Date,
	edited: Boolean
});

module.exports = mongoose.model("Comment",commentSchema);