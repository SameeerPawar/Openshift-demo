var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints : ['98.10.43.51:8080']});
client.connect(function(err, result){
    console.log('cassandra connected: posts');
});

var getAllposts = 'SELECT * FROM demo.posts';

router.get('/', function(req, res){
	if(!req.session.authenticated){
		res.render('unauthorised',{status: 403});
	}else{
	client.execute(getAllposts,[], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('posts',{
				posts: result.rows
			});
		}
	});
	}
});

var getUserposts = 'SELECT * FROM demo.userposts WHERE username = ?';

router.get('/:username', function(req, res){
	if(!req.session.authenticated){
                res.render('unauthorised',{status: 403});
        }else{
	client.execute(getUserposts, [req.params.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('posts',{
				posts: result.rows
			});
		}
	});
	}
});

module.exports = router;
