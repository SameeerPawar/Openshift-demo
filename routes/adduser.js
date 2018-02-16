var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
//var bcrypt = require('bcryptjs');

var client = new cassandra.Client({contactPoints : ['98.10.43.51:8080']});
client.connect(function(err, result){
    console.log('cassandra connected: adduser');
});

router.get('/', function(req, res){
	if(req.session.user){
                res.redirect('/user/'+req.session.user);
        }else{
		res.render('adduser');
	}
});

var upsertUser  = 'INSERT INTO demo.users(username, password, email, name) VALUES(?,?,?,?) if not exists';

router.post('/', function(req, res){
	//var hash = bcrypt.hashSync(req.body.password);
	var hash = req.body.password;
	client.execute(upsertUser, [req.body.username, hash, req.body.email, req.body.name],
		function(err, result){
			if(err){
				res.status(404).send({msg: err});
			} else{
				console.log('User Added');
				res.redirect('/user/'+req.body.username);
			}
		});
});


module.exports = router;
