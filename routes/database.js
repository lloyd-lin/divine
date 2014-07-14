
var mongoose = require('mongoose');
global.db = mongoose.connection;
var host, database, port, options;
var logger = require('./logger');
var settings = require('../setting');
if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
	console.log('use bae environment');
    host = settings.host;
    database = settings.db;
    port = settings.port;
    options = {
        server: {poolSize: 5},
        user: settings.user,
        pass: settings.password,
		auto_reconnect: true,
		keepAlive: 1
    };
} else {
	console.log('use local environment!');
    host = settings.localhost;
    database = settings.localdb;
    port = 27017;
	console.log('connecnt to ' + host+ ':' + database);
}
/*
db.on('connected', function() {
	//monitor mongo connection and close when error occurs
	console.log("Connect to db successfully .Db status:" + db.readyState );
});

db.on('error', function(err) {
	//monitor mongo connection and close when error occurs
	console.log(err + " Db status:" + db.readyState);
	db.close();
});

db.on('close', function() {
	console.log("DB closed. Reconnect.Db status:" + db.readyState);
	//reconnect after close to keep alive
	db.open(host, database, port, options);
})
db.on('disconnected', function() {	
	console.log("Disconnected... Db status:" + db.readyState);
    //db.open(host, database, port, options);
});
*/

db.on('connecting', function() {
	logger.Logger.info('connecting to MongoDB...');
});

db.on('error', function(error) {
	logger.Logger.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});
db.on('connected', function() {
	logger.Logger.info('MongoDB connected!');
});
db.once('open', function() {
	logger.Logger.info('MongoDB connection opened!');
});
db.on('reconnected', function () {
	logger.Logger.info('MongoDB reconnected!');
});
db.on('disconnected', function() {
	logger.Logger.warn('MongoDB disconnected!');
	mongoose.connect(host, database, port, options);
});
mongoose.connect(host, database, port, options);
//db.open(host, database, port, options);
