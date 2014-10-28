(function(exports){

	var  http 		= require('http')
		,https 		= require('https')
		, _ 	 	= require('underscore')
		, users 	= require('./user.js')
		, hook 		= {}
		, db;

	exports.run = function(options){
		db = options.db;
		events();
	}

	exports.indexRoutes = ["/posts","/create"];

	exports.pageData = function(page,session,callback,host,req,res){
		var view = 'index';
		var json = {};
	
		switch(page){
			case "/":
				view = 'index';
				sendPage();
				break;
			case "/posts":
				view = 'posts';
				db.read("item",{"group":"blog"},{limit:20,sort:"-date"},function(error,posts){
					json.posts = posts;
					sendPage();
				})
				break;
			case "/create":
				view = "create";
				sendPage();
				break;
			default:
			 	view = 'index';
			 	sendPage();
			break;
		}


		
		function sendPage(){
			if(!_.isObject(session.p)) return callback(_.defaults(json,{"loggedIn":false}),view);

			db.read("profile",{"_id":session.p},{one:true},function(e,d){
				callback(_.defaults(json,{ "loggedIn":true, user:d }),view);
			})			
		}
		
	}
	
	exports.routes = function(app){
	

		app.get("/api/v1/users",function(req,res){
			users.login(req.session,function(json){
				res.send(json)
			})
		})

		app.post("/post/new",function(req,res){
			if(!_.has(req.session,"p")) return res.redirect("/")
			if(!req.body.title) return res.redirect("/create")
			if(!req.body.text) return res.redirect("/create")

			var json = {};
			json.group = "blog";
			json.title = req.body.title;
			json.body = {};
			json.body.text = req.body.text;
			db.read("profile",{"_id":req.session.p},{one:true},function(e,d){
				json.body.author = {"_id":req.session.p
									,"title":d.title
									,"photo":d.photo};
				db.create("item",json,function(error,data){
					if(error)
						return res.redirect("/create")
					res.redirect("/posts")
				})
			})
		})

		app.get("/post/delete/:id",function(req,res){
			if(!_.has(req.session,"p")) return res.redirect("/")
			db.delete("item",{"_id":req.params.id,"body.author._id":req.session.p},function(error,data){
				res.redirect("/posts")
			})
		})

	return app;
	}
	var events = function(){

	}

return exports;
})(exports)
