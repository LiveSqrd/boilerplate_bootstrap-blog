(function(exports){

	var  http 		= require('http')
		, _ 	 	= require('underscore')
		, hook 		= {}
		, db;

	exports.run = function(options){
		db = options.db;
	}
	exports.newUser = function(client,profile){

	}
	exports.login = function(session,callback){
		var json = {};
		var options = {}
		options.one = true;
		options.select = {"login":0,"ip":0,"__v":0}
		if(_.has(session,"auth")){
			json.result = {}

			db.read("instance",{"_id":session.i},options,function(e0,d0){

				json.error 		= e0;
				json.result.i 	= d0;
				if(_.has(json.result,"c") && _.has(json.result,"p"))
					callback(json);
			})
			db.read("client",{"_id":session.c},options,function(e0,d0){

				json.error 		= e0;
				json.result.c 	= d0;
				if(_.has(json.result,"i") && _.has(json.result,"p"))
					callback(json);
			})
			db.read("profile",{"_id":session.p},options,function(e0,d0){

				json.error 		= e0;
				json.result.p 	= d0;
				if(_.has(json.result,"i") && _.has(json.result,"c"))
					callback(json);
			})

		}else{
			json.error = "Not Logged in";
			callback(json);
		}
	}
	exports.logout = function(session){
	}
	exports.app = function(session,callback){

		
		callback({})
	}
return exports;
})(exports)