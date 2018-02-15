var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
   if(req.session.user){
                res.redirect('/user/'+req.session.user);
   }else{
 	 res.render('index', { title: 'Dwitter' });
   }
});

module.exports = router;
