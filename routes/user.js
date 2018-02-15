var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints : ['argus.cs.rit.edu:9042']});
client.connect(function(err, result){
    console.log('cassandra connected: user');
});

var locals = {};
var result1 = null;
var result2 = null;
var result3 = null;

var getByUsername = 'SELECT * FROM demo.users WHERE username = ?';
var getFollowing = 'SELECT * FROM demo.following WHERE username = ?';
var getFollowers = 'SELECT * FROM demo.followedby WHERE username = ?';

router.get('/:username', function(req, res){
	if(!req.session.authenticated){
                res.render('unauthorised',{status: 403});
        }else{
	client.execute(getByUsername,[req.params.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else {
			result1 = result.rows[0];
			complete();
			}
	});
	client.execute(getFollowing, [req.params.username],function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			result2 = result.rows;
			complete();
		}
	});
	client.execute(getFollowers, [req.params.username],function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			result3 = result.rows;
			complete();
		}
		
	});
	function complete(){
		if(result1 != null && result2 != null && result3 != null){
			res.render('user',{userdata: result1, following: result2, followers: result3});
		}
	}
	}
});

var deleteUser = "DELETE FROM demo.users WHERE username = ?";

router.delete('/:username', function(req, res){
	client.execute(deleteUser,[req.params.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.json(result);
		}
	});
});


module.exports = router;
