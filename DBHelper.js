"use strict";

var os = require( 'os' );
var ipAddress = os.networkInterfaces( ).en0[1].address.replace("Interfaces ","");

//import request and fs
var request = require("request");
var fs = require("fs");
var bodyparser = require("body-parser");

class DatabaseConnection{
	constructor(app,port,mongooseInstance){
		console.log("PORT IS",port);
		this.app = app;
		this.app.use(bodyparser.urlencoded({extended:true}))
		this.app.use(bodyparser.json())
		this.app.use(function(req,res,next){
			console.log("MIDDLEWARE");
			next();
		})
		this.port = port;
		this.mongooseInstance = mongooseInstance;
		this.entities = {};
		this.helpers = [];
		this.clientMethods ={};
		this.filePaths = {};
	}

	sendFileWithDBMethods(path,res){
		var jquery = '<script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>'; 
		var toinsert = "<script>var db =" + JSON.stringify(this.clientMethods) + ";for(var key in db){db[key] = new Function('data',db[key])}</script>"
		toinsert = jquery + toinsert;
		if(this.filePaths[path]){
			var html = this.filePaths[path];
		} else {	
			var html = fs.readFileSync(path,"utf8");
			this.filePaths[path] = html;
		}
		var index = html.indexOf("<head>") + 7;
		//console.log(path);
		html = html.slice(0,index) + toinsert + html.slice(index)
		res.send(html);

	}

	createSchema(givenEntities,summary){
		var tomake = summary.split(";");
		var Schema = this.mongooseInstance.Schema;
		var givenEntitiesAllMongooseTranferrable = true;
		var mongooseRelatable = ["string","number","boolean","Date","[]"];
		for(var key in givenEntities){
			//givenEntities[key] = givenEntities[key];
			//var obj = givenEntities[key]
			Objectmap(givenEntities[key],function(ex){
				var typeOfEntity;
				if(ex.constructor === Date){
					typeOfEntity = "date";
				}
				if(Array.isArray(ex)){
					typeOfEntity = "[]";
				}

				typeOfEntity = typeof ex;

				if(mongooseRelatable.indexOf(typeOfEntity) === -1){
					givenEntitiesAllMongooseTranferrable = false;
				}

				return typeOfEntity;
			})	
			this.entities[key] = this.mongooseInstance.model(key,new Schema(givenEntities[key]));
		}
		if(!givenEntitiesAllMongooseTranferrable){
			throw "Your example must only include types that can be instantiated in mongoose";
		}
		//console.log(this.entities)
		for(var modelName in this.entities){

			var that = this;

			this.helpers["get"+ "All" + modelName + "s"] = function(cb){
				that.entities[modelName].find({}).exec(function(err,models){
					cb(JSON.stringify(models))
				})
			}
			

			this.app.get("/getAll" + modelName + "s",function(req,res){
				that.helpers["get"+ "All" + modelName + "s"](function(data){
					res.setHeader("Access-Control-Allow-Headers","x-requested-with");
					res.setHeader("Access-Control-Allow-Origin","*");
					res.end(data);
				})

			})

			this.clientMethods["/getAll" + modelName + "s"] = createDBAjaxReq("/getAll" + modelName + "s",this.port);
			
			this.helpers["get" + "Specific" + modelName] = function(model,cb){
				that.entities[modelName].find(model).exec(function(err,models){
					if(err){
						cb(err);
					} else {
						cb(JSON.stringify(models))
					}
				})
			}

			this.app.get("/getSpecific" + modelName,function(req,res){
				res.setHeader("Access-Control-Allow-Headers","x-requested-with");
				res.setHeader("Access-Control-Allow-Origin","*");
				var model = req.body.lookingfor;
				that.helpers["get" + "Specific" + modelName](model,function(data){
					res.end(data);
				})

			})

			this.clientMethods["/getSpecific" + modelName] = createDBAjaxReq("/getSpecific" + modelName,this.port);

			this.helpers["post"+ modelName] = function(model,cb){
				//make it only post if its already there
				that.entities[modelName].find(model).exec(function(err,returnedModel){
					if(err){
						cb(err);
					} else {
						if(returnedModel.length>0){
							cb("That record was already there!")
						} else {
							that.entities[modelName].create(model,function(err,data){
								console.log(data);
								var toReturn;
								if(err){toReturn = err} else {
									toReturn = JSON.stringify(data);
								}
								cb(toReturn)
							})

						}
					}

				});
			}

			this.app.post("/add"+ modelName,function(req,res){
				res.setHeader("Access-Control-Allow-Headers","x-requested-with");
				res.setHeader("Access-Control-Allow-Origin","*");
				var model = req.body;
				that.helpers["post" + modelName](model,function(data){
					res.end(data);
				})

			})

			this.clientMethods["/add" + modelName] = createDBAjaxReq("/add" + modelName,this.port,"post");


			this.helpers["update" + modelName]= function(model,change,cb){
				that.entities[modelName].findOneAndUpdate(model,change,{},function(err,doc){
					if(err){cb(err)} else {
						cb("Updated!");
					}
				})
			}

			this.app.post("/update" + modelName,function(req,res){
				console.log("UPDATED");
				res.setHeader("Access-Control-Allow-Headers","x-requested-with");
				res.setHeader("Access-Control-Allow-Origin","*");
				var model = req.body.find;
				var change = req.body.change;
				console.log(model);
				console.log(change)
				that.helpers["update" + modelName](model,change,function(data){
					res.end(data);
				})

			})

			this.clientMethods["/update" + modelName] = createDBAjaxReq("/update" + modelName,this.port,"post");

			this.helpers["delete" + modelName] = function(model,cb){
				that.entities[modelName].findOneAndRemove(model,{},function(err,doc){
					if(err){
						cb(err);
					} else {
						cb("Deleted" + JSON.stringify(doc));
					}
				})
			}

			this.app.post("/delete" + modelName,function(req,res){
				console.log("DELETED");
				res.setHeader("Access-Control-Allow-Headers","x-requested-with");
				res.setHeader("Access-Control-Allow-Origin","*");
				var model = req.body;
				that.helpers["delete" + modelName](model,function(data){
					res.end(data);
				})
			})

			this.clientMethods["/delete" + modelName] = createDBAjaxReq("/delete" + modelName,this.port,"post");


		}
	}

}

function Objectmap(obj,cb){
	for(var key in obj){
		obj[key] = cb(obj[key])
	}

}

function createDBAjaxReq(name,port,method){
	if(!method){method = "'get'"}
	else {method = "'" + method + "'"}

	var url = "http://"+ ipAddress + ":" + port + name; 
	return "console.log(data); var toReturn = ''; $.ajax({type:" + method + ",url:'"+url+"',async:false,success:function(returnData){toReturn = returnData},failure:function(err){console.log(err)},data:data}); return toReturn;";
}

module.exports = DatabaseConnection