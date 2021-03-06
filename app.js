var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var session = require('express-session');
var flash = require('connect-flash');
//var bcrypt = require('bcryptjs');

var routes = require('./routes/index');
var users = require('./routes/users');
var user = require('./routes/user');
var adduser = require('./routes/adduser');
var posts = require('./routes/posts');
var addposts = require('./routes/addposts');
var follow = require('./routes/follow');
var login = require('./routes/login');
var logout = require('./routes/logout');

var port = "8080";
var app = express();
app.listen(port);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'booyah', saveUninitialized: true, resave: true, cookie:{secure:false}}));
app.use(flash());
//app.use(bcrypt);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/user', user);
app.use('/adduser', adduser);
app.use('/posts', posts);
app.use('/addposts', addposts);
app.use('/follow', follow);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(checkAuth);
function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if ((req.url !== '/login' && req.url !== '/' && req.url !== '/adduser') && ( !req.session.user)) {
		res.render('unauthorised', { status: 403 });
		return;
	}

	next();
}

module.exports = app;
