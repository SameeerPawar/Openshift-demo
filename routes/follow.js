var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints : ['argus.cs.rit.edu:9042']});
client.connect(function(err, result){
    console.log('cassandra connected: addPosts');
});


router.post('/', function(req, res){
	var query1= 'INSERT INTO demo.following(username, friendname) VALUES(?,?) if not exists';
	var query2=  'INSERT INTO demo.followedby(username, friendname) VALUES(?,?) if not exists';
	client.execute(query1, [req.session.user, req.body.friendname], function(err){
		console.log(err);
		console.log('TEST');
	});
	client.execute(query2, [req.body.friendname, req.session.user], function(err){
		console.log(err);
		res.redirect('/user/'+req.body.friendname);	
	});
});


module.exports = router;
