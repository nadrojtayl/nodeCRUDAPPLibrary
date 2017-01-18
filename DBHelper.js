"use strict";

//determine ip address of this computer on network
//you also have the option of enetering own IP as argument

//import request and fs
var bodyparser = require("body-parser");
var fs = require("fs");
var mongoose = require("mongoose");

class DatabaseConnection{
	constructor(app,port,mongooseInstance,ipAddress){
		console.log("PORT IS",port);
		this.app = app;
		this.app.use(bodyparser.urlencoded({extended:true}))
		this.app.use(bodyparser.json())
		this.port = port;
		this.mongooseInstance = mongooseInstance;
		this.entities = {};
		this.helpers = [];
		this.clientMethods ={};
		this.filePaths = {};
		this.ipAddress = ipAddress;
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

	createSchema(givenEntities,relationships){
		
		var Schema = this.mongooseInstance.Schema;
		var givenEntitiesAllMongooseTranferrable = true;
		var mongooseRelatable = ["string","number","boolean","Date","[]","object"];
		for(var key in givenEntities){
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
					console.log(typeOfEntity);
					givenEntitiesAllMongooseTranferrable = false;
				}

				return typeOfEntity;
			})
			
		}

		for(var key in givenEntities){
			if(relationships && relationships[key]){
				relationships[key].forEach(function(refName){
					console.log("key",key);
					console.log("refName",refName)
					givenEntities[key][refName + "s"] = [{type: Schema.Types.ObjectId, ref: refName}]
					givenEntities[refName]["_" + key] = {type: mongoose.Schema.Types.ObjectId, ref: key,required:true }
				})
			}
			var newSchema = new Schema(givenEntities[key]);
			this.entities[key] = this.mongooseInstance.model(key,newSchema);
		}
		var inverseRelations = {};
		for(var key in relationships){
			relationships[key].forEach(function(subrelation){
				if(!(subrelation in inverseRelations)){
					inverseRelations[subrelation] = [key];
				} else {
					inverseRelations[subrelation].push(key);
				}
			})
		}

		if(!givenEntitiesAllMongooseTranferrable){
			throw "Your example must only include types that can be instantiated in mongoose";
		}
		for(var entity in this.entities){
			var that = this;
			var closure = function(){
				var modelName = entity;


				if(entity in inverseRelations){
					var str = "";
					inverseRelations[modelName].forEach(function(fkey,ind){
						if(ind === 0){
							str += (fkey);
						} else {
							str += ("and" + fkey);
						}
					})

					that.helpers["add" + modelName + "for" + str] = function(fkeys,newDoc,cb){
						var arr = Object.keys(fkeys), i = 0;
						var ids = {};
						recurse(cb,0);
						function recurse(cb,i){
							if(arr[i]){
								that.entities[arr[i]].findOne(fkeys[arr[i]]).exec(function(err,data){
									ids[arr[i]] = data._id;
									recurse(cb,i+1);
								})
							} else {
								for(var id in ids){
									newDoc["_" + id] = ids[id];
								}
								var toSave = new that.entities[modelName](newDoc);
								toSave.save(function(err,data){
									cb(data);
								})
							}
						}
					}
				}

				
				that.helpers["get"+ "All" + modelName + "s"] = function(cb){
					console.log("modelName",modelName);
					that.entities[modelName].find({}).exec(function(err,models){
						//console.log(models);
						cb(JSON.stringify(models))
					})
				}

				

				that.app.get("/getAll" + modelName + "s",function(req,res){
					that.helpers["get"+ "All" + modelName + "s"](function(data){
						res.setHeader("Access-Control-Allow-Headers","x-requested-with");
						res.setHeader("Access-Control-Allow-Origin","*");
						res.end(data);
					})

				})

				that.clientMethods["getAll" + modelName + "s"] = createDBAjaxReq("/getAll" + modelName + "s",that.port,"get",that.ipAddress);
				
				that.helpers["get" + "Specific" + modelName] = function(model,cb){
					that.entities[modelName].find(model).exec(function(err,models){
						if(err){
							cb(err);
						} else {
							cb(JSON.stringify(models))
						}
					})
				}

				that.app.post("/getSpecific" + modelName,function(req,res){
					res.setHeader("Access-Control-Allow-Headers","x-requested-with");
					res.setHeader("Access-Control-Allow-Origin","*");
					var model = req.body;
					that.helpers["get" + "Specific" + modelName](model,function(data){
						res.end(data);
					})

				})

				that.clientMethods["getSpecific" + modelName] = createDBAjaxReq("/getSpecific" + modelName,that.port,"post",that.ipAddress);
					
				that.helpers["add"+ modelName] = function(model,cb){	
					that.entities[modelName].find(model).exec(function(err,returnedModel){
						if(err){
							console.log(err);
							cb(err);
						} else {
							if(returnedModel.length>0){
								cb(JSON.stringify(["That record was already there!"]));
							} else {
								that.entities[modelName].create(model,function(err,data){
									console.log(data);
									var toReturn;
									if(err){toReturn = err} else {
										toReturn = JSON.stringify(data);
									}
									cb(JSON.stringify(toReturn));
								})

							}
						}

					});
				}

				that.app.post("/add"+ modelName,function(req,res){
					res.setHeader("Access-Control-Allow-Headers","x-requested-with");
					res.setHeader("Access-Control-Allow-Origin","*");
					var model = req.body;
					that.helpers["add" + modelName](model,function(data){
						res.end(data);
					})

				})

				that.clientMethods["add" + modelName] = createDBAjaxReq("/add" + modelName,that.port,"post",that.ipAddress);


				that.helpers["update" + modelName]= function(model,change,cb){
					that.entities[modelName].findOneAndUpdate(model,change,{},function(err,doc){
						if(err){cb(err)} else {
							cb(JSON.stringify(doc));
						}
					})
				}

				that.app.post("/update" + modelName,function(req,res){
					console.log("UPDATED");
					res.setHeader("Access-Control-Allow-Headers","x-requested-with");
					res.setHeader("Access-Control-Allow-Origin","*");
					var model = req.body.find;
					var change = req.body.change;
					console.log("BODY",req.body);
					console.log(change)
					that.helpers["update" + modelName](model,change,function(data){
						res.end(data);
					})

				})

				that.clientMethods["update" + modelName] = createDBAjaxReq("/update" + modelName,that.port,"post",that.ipAddress);

				that.helpers["delete" + modelName] = function(model,cb){
					that.entities[modelName].findOneAndRemove(model,{},function(err,doc){
						if(err){
							cb(err);
						} else {
							console.log(typeof doc);
							cb(JSON.stringify(doc));
						}
					})
				}

				that.app.post("/delete" + modelName,function(req,res){
					console.log("DELETED");
					res.setHeader("Access-Control-Allow-Headers","x-requested-with");
					res.setHeader("Access-Control-Allow-Origin","*");
					var model = req.body;
					that.helpers["delete" + modelName](model,function(data){
						res.end(data);
					})
				})

				that.clientMethods["delete" + modelName] = createDBAjaxReq("/delete" + modelName,that.port,"post",that.ipAddress);
				// that.helpers["testMessage"]();
			}
			closure();
		}
	}
	// this.helpers["testUsers"]();
}

function Objectmap(obj,cb){
	for(var key in obj){
		obj[key] = cb(obj[key])
	}

}

function createConnections(){

}

function createDBAjaxReq(name,port,method,ipAddress){
	if(!method){method = "'get'"}
	else {method = "'" + method + "'"}

	var url = "http://"+ ipAddress + ":" + port + name; 
	return "console.log(data); var toReturn = ''; $.ajax({type:" + method + ",url:'"+url+"',async:false,success:function(returnData){toReturn = JSON.parse(returnData)},failure:function(err){console.log(err)},data:data}); return toReturn;";
}

module.exports = DatabaseConnection