
var mongoose = require('mongoose');
var models = require('./models');
var util = require('util');
var User = db.models.User;
var Divine = db.models.Divine;
var crypto = require('crypto');
var flash = require("connect-flash");
/*
 * GET home page.
 */
/** standard
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

module.exports = function(app) {
	app.get('/', function(req,res){
		return res.render('home',{ title: "Lloyd's"});	
	});
	
	app.get('/divine', function(req,res){
		return res.render('divine',{ title: "Lloyd's"});	
	});
	
	app.get('/divineDate', function(req,res){
		if (isLogin(req)) {
			return res.render('divineDate',{ title: "Lloyd's"});	
		} else {
			req.flash('error','请先登录');
			return res.redirect('/');
		}
	});
	
	app.get('/divineInfo', function(req,res){
		return res.render('divineInfo',{ title: "Lloyd's"});	
	});
	
	app.get('/divineStudy', function(req,res){
		return res.render('divineStudy',{ title: "Lloyd's"});	
	});
	
	app.get('/divineAdv', function(req,res){
		return res.render('divineAdv',{ title: "Lloyd's"});	
	});
	
	app.get('/regist', function(req,res){
		return res.render('register',{ title: "Lloyd's"});	
	});
	
	app.get('/filterDate', checkLogin);
	app.get('/filterDate', function(req,res){
			//var query_doc = {userid:req.session.user.userid};
			//console.log(query_doc);
			var query = Divine.find().exec();
			query.addBack(function (err,docs) {
				console.log(docs);
				return res.send(docs);	
			});		
	});
	
	app.post('/reserveDate', checkLogin);
	app.post('/reserveDate', function(req,res){
		var divine = new Divine({userid:req.session.user.userid,reserve_time:req.body.date,time:new Date()});
		divine.save(function(err){
					if (err) {
						util.log("Save error");
						return res.send(false);	
					}
				});
		return res.send(true);	
	});
	
	app.post('/regist', function(req,res){
		if(req.body['password-repeat']!=req.body['password']){
			util.log("here");
			req.flash('error','两次输入的口令不一致');
			return res.redirect('/regist');
		}
		var query_doc= {userid:req.body.username} ;
		var query = User.find(query_doc).exec();
		query.addBack(function (err,docs) {
			if (docs.length == 0){
				var md5= crypto.createHash('md5');
				var password = md5.update(req.body.password).digest('base64');
				var user= new User({userid:req.body.username,password:password}) ;
				user.save(function(err){
					if (err) {
						util.log("Save error");
					}
				});
				req.session.user = user;
				req.flash('success','注册成功');
				return res.redirect('/');
				//return res.render('regist/success', { title: "Lloyd's" , user:req.body.username});
			} else {
				req.flash('error','注册失败');
				return res.redirect('/regist');
				//return res.render('regist/fail',{ error:'账号已被注册！'});
			}
		});
	});

	app.get('/logout', checkLogin);
	app.get('/logout', function(req,res){
		req.session.user = null;
		req.flash('success','登出成功！');
		return res.redirect('/');
	});
	
	app.post('/login', function(req,res){
		var md5= crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var query_user= {userid:req.body.username} ;
		console.log(req.body.username);
		var query_password= {userid:req.body.username,password:password} ;
		User.count(query_user , function(err,doc){
			if (doc == 0) {
				req.flash('error','该用户不存在，请先注册！');
				return res.redirect('/');
			} else {
				var user = new User(query_password);
				User.count(query_password , function(err,result){
					if (result == 0) {
						req.flash('error','用户密码输入错误，请重新输入！');
						return res.redirect('/');
					} else {
						req.flash('success','登陆成功！');
						req.session.user = user;
						return res.redirect('/');
					}
				});
			}
		});
	});
	
	app.get('/adminConsole', function(req,res){
		return res.render('adminCOnsole',{ title: "Lloyd's"});	
	});
	
	
	function isLogin(req){
		if (req.session.user != null){
			return true;
		}
		else {
			return false;
		}
	}
	function checkLogin(req,res,next){
		if (!req.session.user) {
			req.flash('error','未登录');
			return res.redirect('login');
		}
		next();
	}
	
	function checkNotLogin(req,res,next){
		if (req.session.user) {
			req.flash('error','已登录');
			return res.redirect('/');
		}
		next();
	}
}