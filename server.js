/**
var http = require('http');
var port = 18080;
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
}).listen(port);
*/
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();
var MongoStore = require('connect-mongo')(express);
var settings = require('./setting');
var flash = require("connect-flash");
require('./routes/database');
// all environments
app.configure(function() {
	app.set('port', 18080);
	app.set('views', path.join(__dirname, 'views'));
	app.engine('html',ejs.__express);
	app.set('view engine', 'html');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.session({
		secret:settings.cookieSecret,
		cookie: { maxAge: 20 * 60 * 1000 },
		store: new MongoStore({ 
			url: process.env.SERVER_SOFTWARE == 'bae/3.0' ? 			'mongodb://'+ settings.user+':' + settings.password + '@' + settings.host+ ':' + settings.port + '/' + settings.db + '/sessions' : 'mongodb://localhost/divine' ,
			auto_reconnect: true
			},function (){
				console.log("Mongo Session Ready!");
			})
	}));
	app.use(flash());
	app.use(function (req,res,next){
	res.locals.user = req.session? req.session.user: null;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
}	);	
	app.use(app.router);
});


routes(app);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});