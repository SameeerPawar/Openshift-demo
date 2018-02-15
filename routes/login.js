var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
//var bcrypt = require('bcryptjs');

var client = new cassandra.Client({contactPoints : ['argus.cs.rit.edu:9042']});
client.connect(function(err, result){
    console.log('cassandra connected: login');
});


var getUserData = 'SELECT * FROM demo.users where username =?';
router.get('/', function(req, res){
	if(req.session.user){
		res.redirect('/user/'+req.session.user);
	}else{
		res.render('login',{flash : req.flash()});
	}
});


router.post('/', function(req, res){
	client.execute(getUserData, [req.body.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else if(result.rows.length<1){
			req.flash('error', 'User not registered');
			res.redirect('/login');	
		}else if(req.body.password == result.rows[0].password){
			req.session.regenerate(function(){
				req.session.user = req.body.username;
				req.session.authenticated = true;
				res.redirect('/user/'+req.body.username);
			});
		}else {
			req.flash('error', 'Username and password are incorrect');
			res.redirect('/login');
		}
	});
});

module.exports = router;
