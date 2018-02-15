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

	var queries = [
		{
			query: 'INSERT INTO demo.posts(postid, username, content, image) VALUES(?,?,?,?)',
			params:[id1, req.body.username, req.body.body, 0]
		},
		{
			query: 'INSERT INTO demo.userposts(username, postid, content, image) VALUES(?,?,?,?)',
			params: [req.body.username, id2, req.body.body, 0]
		}
	];
	queryOptions = {};
	client.batch(queries, queryOptions, function(err){
		console.log(err);
		res.redirect('/posts');
	});
});


module.exports = router;