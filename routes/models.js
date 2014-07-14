
var mongoose = require('mongoose');
require('./database');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userid: String,
	name: String,
	phonenumber: String,
	password: String
	});

var DivineSchema = new Schema ({
	userid: String,
	content: String,
	reserve_time: Date,
	order_num: String,
	time: Date,
	});
exports.User= db.model('User',UserSchema);
exports.Divine= db.model('Divine',DivineSchema);