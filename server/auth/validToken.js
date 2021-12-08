const jwt = require("jsonwebtoken");

// validate or denies access to page.  

module.exports = function(req, res, next) {
	const authHeader = req.headers['authorization'];
	let token
	if (authHeader) {
		token = authHeader.split(' ')[1];
	} else {
		return res.sendStatus(401);
	}

	jwt.verify(token, process.env.SECRET, (err, user) => {
		if(err) return res.sendStatus(401);
		req.user = user;
		next();
	})

};