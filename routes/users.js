var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const validToken = require('../auth/validToken.js'); 
const mongoose = require("mongoose");
const User = require("../models/User");
const Image = require("../models/Picture");
const {body, validationResult} = require("express-validator");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});

//this is to check special symbols in password
var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;


// This route handles the user information


router.get('/:username', (req, res) => {
	let username = req.params.username;
	User.findOne({username:username}, (err, user) => {
		if(user) {
			return res.json({username: user.username, profile: user.profile});
		} else {
			let error = "This user dosen't exists anymore";
			return res.json({errors: error});
		}
	})
})

// To fetch username's pictureId. 
router.get('/picture/:username', (req, res) => {
	let username = req.params.username;
	User.findOne({username:username}, (err, user) => {
		if(user) {
			console.log(user.profile.profileImg);
			return res.json({username: user.username, profileImg: user.profile.profileImg});
		} else {
			let error = "This user dosen't exists anymore";
			return res.json({errors: error});
		}
	})
})

/*
	Registering happens here. Password needs to pass some test
	If didnt, it will send errors. Username can't be same name.
	username error willl be appended to validationResult errors
*/


router.post('/register', upload.none(),
	body('password')
	// minimun length 8
	.isLength({min: 8})
	.withMessage('Too weak password when registering')
	// has at least one lowercase
	.custom(value =>{
		let check = value.toUpperCase();
		return ((check !== value) ? true : Promise.reject('Too weak password when registering'))
	}) 
	// has at least one uppercase
	.custom(value =>{
		let check = value.toLowerCase();
		return ((check !== value) ? true : Promise.reject('Too weak password when registering'))
	})
	// has at least one number
	.custom(value =>{
		return (/\d/.test(value) ? true : Promise.reject('Too weak password when registering'))
	})
	// has at least one special character
	.custom(value =>{
		return (format.test(value) ? true : Promise.reject('Too weak password when registering'))
	}),
	(req, res, next) => {
		let errors = validationResult(req);
		console.log(req.body)
		
	  	User.findOne({username: req.body.username}, (err, user) => {
		    if(err) return next(err);
		    if(!user && errors.isEmpty()) {
		    	var pass = req.body.password;
		    	var salt = bcrypt.genSaltSync();
		    	pass = bcrypt.hashSync(pass, salt);

		    	let defaultProfile = {
		  			created: new Date(),
		    		name: "",
		    		age: 0,
		    		gender: "",
		    		email: "",
		    		profileImg: "",
		    		about:""
		    	};

			    new User({
			      	username: req.body.username,
			      	password: pass,
			      	admin: false,
			      	profile: defaultProfile
			    })
		      .save((err) => {
		        	if(err) return next(err);
		        	return res.json({status: "ok"});
		      });

		    } else {
		    	console.log("juu")
		    	errors = errors.array();
		    	console.log(errors)
		    	if(user) {
			    	errors.push({
			    		value : req.body.username,
			    		msg: "Duplicate username in registration",
			    		param: "username",
			    		location: "body"
			    	})
		    	}
				return res.json({errors: errors});
		    }
  		});
	}
);

router.post('/login/', upload.none(), (req, res, next) => {
	let errors = [];
	const password = req.body.password;
	const username = req.body.username;

  	User.findOne({username: username}, (err, user) => {
    	if(err) return next(err);
    	if(user) {
    		// To check if the password is correct
 			if(bcrypt.compareSync(password, user.password)) {
 				var token = jwt.sign(
					{
						"username" : username,
						"admin" : user.admin
					},
					process.env.SECRET,		// some secret in env file
					{
						expiresIn: 1800 // token experationtime 
					},
					(err, token) => {
						res.json({
							"userId" : user._id,
							"username" : user.username,
							"success" : true, 
							token
						});
					}
 				);	
 			} else {
 				errors.push({
 					value: password,
 					msg: "Trying to log in with a wrong password",
 					param: "password",
 					location: "body"
 				})
 				
 				res.status(403).json({errors : errors})
 			}
    	} else {
    		errors.push({
 					value: username,
 					msg: "Trying to log in with an username that doesn't exist in database",
 					param: "username",
 					location: "body"
 			})
      		return res.status(403).json({errors : errors})
    	}
    });
});

// This is profile update route. It has to have every field, and this will
// save profile pic as well 
// Returns the updated content for client data refresh purposes  
router.patch('/profile/:username',validToken ,upload.single("image"),
	(req, res, next) => {
		let username = req.params.username;
		console.log(req.body);
		let picId = "";

		if(req.body.image === "Default") {
			picId = "";
		} else if (!req.file) {
			picId = req.body.image;
		} else {
			picId = mongoose.Types.ObjectId();
			new Image({
				_id: picId,
		        name: req.file["orginalname"],
		        encoding: req.file["encoding"],
		        mimetype: req.file["mimetype"],
		        buffer: req.file["buffer"]
			}).save(() => console.log("Saving"))
		}

		
		User.updateOne({username: username}, 
			{'$set': {
		    	"profile.name": req.body.name,
	    		"profile.age": req.body.age,
	    		"profile.gender": req.body.gender,
	    		"profile.email": req.body.email,
	    		"profile.about": req.body.about,
	    		"profile.profileImg": picId
			}},
			(err,result) => {
				if(result) {
		  			return res.json({
		  				status: "ok",
		  				profile: {
			  				name: req.body.name,
		    				age: req.body.age,
				    		gender: req.body.gender,
				    		email: req.body.email,
				    		about: req.body.about,
				    		profileImg: picId
			    		},
						result
					});
		  		} else {
		  			return res.json({status: "not ok", result});
		  		}
			}
		);
	}
);


module.exports = router;