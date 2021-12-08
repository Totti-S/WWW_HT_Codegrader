var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const Image = require("../models/Picture");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


/*
	There is getter and setter for profile pictures
	Getter is only for Url ids. 
*/


router.get('/:imageid',(req,res,next) => {
	let id = mongoose.Types.ObjectId(req.params.imageid);

	Image.findById(id, (err, image) => {
		if(err) return next(err);		
		if(image) {
			res.set({
				"Content-Disposition": "inline",
				"Content-Type":"image/jpeg"
			});
			res.send(image["buffer"]);
		} else {
			res.status(403).send("No id image")
		}
	})
	
});


router.post('/',upload.single("image"), (req, res,next) =>{
	console.log("Uploading")
	console.log(req.file["originalname"])
	let id = mongoose.Types.ObjectId();
	new Image({
		_id: id,
        name: req.file["orginalname"],
        encoding: req.file["encoding"],
        mimetype: req.file["mimetype"],
        buffer: req.file["buffer"]
	})
	.save(() => {
		console.log("Saving")
	});
	res.json(id)
	
});

module.exports = router;