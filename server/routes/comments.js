var express = require('express');
var router = express.Router();
var cors = require('cors');

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});

const mongoose = require("mongoose");
const Comment = require("../models/Comment.js");
const validToken = require('../auth/validToken.js'); 
const {body, validationResult} = require("express-validator");


// Finds all comments that are linked to post with url id
router.get('/:id', function(req, res, next) {
   	Comment.find({postId : req.params.id}, (err, comments) => {
   		res.json(comments);
   	})
});

// For making a new post
router.post('/', upload.none(), validToken,
	
	(req, res, next) => {
		let errors = validationResult(req);
		let token = req.headers['authorization'].split(' ')[1];
		let time;
		console.log(req.body);
		if(errors.isEmpty()) {
			if(!req.body.time) {
				time  = new Date();

			} else {
				time = req.body.time;
			}
			let payload = JSON.parse(Buffer.from(token.split('.')[1],'base64').toString());
			let username = payload.username;

			new Comment({
				username: username,
				time: time,
				comment: req.body.comment,
				likes: {},
				postId: req.body.postId,
				count: 0,
				editTime: time,
				edited: false
			})
			.save((err) => {
	        	if(err) return next(err);
	        	return res.json({status: "ok"});
	     	});
		} else {
			return res.json({errors: errors});
		}
	}
);

// For updating a single change to "like" counting
// Takes in the button value to determine if the like button was turned off
// If turned off, id will be removed from "likes" object
router.patch('/like', upload.none(), 
	(req, res, next) => {

	const like = req.body.like;
	const count = req.body.count;
	const userId = req.body.userId;
	const commentId = req.body.commentId;
	Comment.findOne({_id:commentId}, (err,comment) => {
		let value;
		if(comment) {
			// Checking if there was liked before by this user and
			// if it's the same as what we are trying to set.
			value = comment.likes.has(userId) ? (comment.likes.get(userId) === like) : false;
		}

		let string = "likes."+userId;

		// Only unset if we found id and it was the same
		let updateString = (value ? 
			{count:count, '$unset' : {[string]: 1}} :
			{count:count, '$set' : {[string]: like}}
		);

		console.log(updateString)
	  	Comment.updateOne({_id: commentId}, updateString ,(err, result) => {
			if(result) {
				return res.json({status: "ok", value: value,result});
			} else {
				return res.json({status: "not ok", result});
			}
		});
  	});
});

// For edinting the comment. 
router.patch('/:id', upload.none(), validToken,
	(req, res, next) => {

		let id = req.params.id;
		let change = {
			comment: req.body.content,
			editTime: new Date(),
			edited: true
		}

		Comment.updateOne({_id: id}, change ,(err, result) => {
		if(result) {
			return res.json({status: "ok", newText: req.body.content,result});
		} else {
			return res.json({status: "not ok", result});
		}
	});

	}
);

// For deleting the comment with ID
router.delete('/:id', validToken,
	(req, res, next) => {
		Comment.deleteOne({_id: req.params.id}, (err, result) => {
			if(err) return next(err);
			if(result) {
				return res.json({status: "ok", result});
			}
		})
	}
);






module.exports = router;
//eof