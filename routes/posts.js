var express = require('express');
var router = express.Router();
var cors = require('cors');

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});

const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const validToken = require('../auth/validToken.js'); 
const {body, validationResult} = require("express-validator");


/*GETTERS*/

router.get('/', function(req, res, next) {
   	Post.find({}, (err, posts) => {
   		res.json(posts);
   	})
});

router.get('/:id', function(req, res, next) {
   	Post.find({_id: req.params.id}, (err, posts) => {
   		res.json(posts);
   	});
});

router.get('/:user', function(req, res, next) {
   	Post.find({username: req.params.user}, (err, posts) => {
   		res.json(posts);
   	});
});

/*OTHERS*/

router.post('/', upload.none(), validToken,
	(req, res, next) => {
		let errors = validationResult(req);
		let token = req.headers['authorization'].split(' ')[1];
		let time;
		console.log(req.user);
		if(errors.isEmpty()) {
			if(!req.body.time) {
				time  = new Date();

			} else {
				time = req.body.time;
			}
			new Post({
				username: req.user.username,
				title: req.body.title,
				time: time,
				likes:{},
				post: req.body.post,
				codeType: req.body.codeType,
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

/* 
*  This route is here to update post likes
*  body needs to include 
*	 like: Boolean - Like buttons value that was pressed
*	 count: number  - What is the new count for like number
*    userId: String	 - Who liked
*	 postId: String  - What post was liked
*/	
router.patch('/like', upload.none(), 
	(req, res, next) => {

	const like = req.body.like;
	const count = req.body.count;
	const userId = req.body.userId;
	const postId = req.body.postId;
	Post.findOne({_id:postId}, (err,post) => {
		let value;
		if(post) {
			// Checking if there was liked before by this user and
			// if it's the same as what we are trying to set.
			value = post.likes.has(userId) ? (post.likes.get(userId) === like) : false;
		}

		let string = "likes."+userId;

		// Only unset if we found id and it was the same
		let updateString = (value ? 
			{count:count, '$unset' : {[string]: 1}} :
			{count:count, '$set' : {[string]: like}}
		);

		console.log(updateString)
	  	Post.updateOne({_id: postId}, updateString ,(err, result) => {
			if(result) {
				return res.json({status: "ok", value: value,result});
			} else {
				return res.json({status: "not ok", result});
			}
		});
  	});
});

// Update the content inside existing post
router.patch('/:id', upload.none(), validToken,
	(req, res, next) => {

		let id = req.params.id;
		let change = {
			post: req.body.content,
			editTime: new Date(),
			edited: true
		}

		Post.updateOne({_id: id}, change ,(err, result) => {
			if(result) {
				return res.json({status: "ok", newText: req.body.content,result});
			} else {
				return res.json({status: "not ok", result});
			}
		});
	}
);

// Delete spesific post with url id
router.delete('/:id', validToken,
	(req, res, next) => {
		Post.deleteOne({_id: req.params.id}, (err, result) => {
			Comment.deleteMany({postId: req.params.id}, (err, result) => {
				if(err) return next(err);
				if(result) return res.json({status: "ok", result});
				else return res.json({status: "not ok"}); 
			});
		});
	}
);



module.exports = router;
