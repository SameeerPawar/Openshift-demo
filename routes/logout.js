var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');



router.get('/', function(req, res){
	req.session.user = null;
	req.session.authenticated = false;
	req.session.destroy();
	res.redirect('/');
});


module.exports = router;
