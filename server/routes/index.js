var express = require('express');
var router = express.Router();

/*
	No need for index router
*/

router.get('/', function(req, res) {
	res.send("Response send corretly");
})

module.exports = router;