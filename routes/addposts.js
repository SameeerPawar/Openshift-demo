var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints : ['argus.cs.rit.edu:9042']});
client.connect(function(err, result){
    console.log('cassandra connected: addPosts');
});


router.post('/', function(req, res){
	var id1 = cassandra.types.uuid();
	var id2 = cassandra.types.timeuuid();
	var query1 = 'INSERT INTO demo.posts(postid, username, content) VALUES(?,?,?)';
	var query2 = 'INSERT INTO demo.userposts(username, postid, content) VALUES(?,?,?)';
	client.execute(query1, [id1, req.session.user, req.body.body], function(err){
		console.log(err);
		console.log('TEST');
	});
	client.execute(query2, [req.session.user, id2, req.body.body], function(err){
		console.log(err);
		res.redirect('/posts/'+req.session.user);	
	});
});


module.exports = router;
