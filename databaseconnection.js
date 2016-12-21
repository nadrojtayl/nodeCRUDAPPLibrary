"use strict";

class DatabaseConnection{
	constructor(app,mongooseInstance){
		this.app = app;
		this.mongooseInstance = mongooseInstance;
		this.entities = {};
		this.jsTypestoMongoose = {
			
		}
		this.endpointNames = {

		}
		this.helpers = [];
	}

	createSchema(givenEntities,summary){
		var tomake = summary.split(";");
		var Schema = this.mongooseInstance.Schema;
		for(var key in givenEntities){
			//givenEntities[key] = givenEntities[key];
			//var obj = givenEntities[key]
			Objectmap(givenEntities[key],function(ex){
				return typeof ex;
			})
			
			this.entities[key] = this.mongooseInstance.model(key,new Schema(givenEntities[key]));
		}
		//console.log(this.entities)
		for(var modelName in this.entities){
			var that = this;
			this.helpers["get"+ "All" + modelName + "s"] = function(cb){
				that.entities[modelName].find({}).exec(function(err,models){
					cb(JSON.stringify(models))
				})
			}

			this.app.get("All" + modelName + "s",function(req,res){
				that.helpers["get"+ "All" + modelName + "s"](function(data){
					res.end(data);
				})

			})
			
			this.helpers["get" + "Specific" + modelName] = function(model,cb){
				that.entities[modelName].find(model).exec(function(err,models){
					if(err){
						cb(err);
					} else {
						cb(JSON.stringify(models))
					}
				})
			}

			this.app.get("specific" + modelName,function(req,res){
				var model = req.body.lookingfor;
				that.helpers["get" + "Specific" + modelName](model,function(data){
					res.end(data);
				})

			})

			this.helpers["post"+ modelName] = function(model,cb){
				//make it only post if its already there
				that.entities[modelName].find(model).exec(function(err,returnedModel){
					if(err){
						cb(err);
					} else {
						if(returnedModel.length>0){
							cb("That record was already there!")
						} else {
							console.log(model);
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

			this.app.post(modelName,function(req,res){
				var model = req.body.lookingfor;
				that.helpers["post" + modelName](model,function(data){
					res.end(data);
				})

			})

			this.app.put(modelName,function(req,res){
				var model = req.body.lookingfor;
				var change = req.body.change;
				this.entities[modelName].findOneAndUpdate(model,change,{},function(err,doc){
					if(err){res.end(err)} else {
						res.end("Updated!");
					}
				})

			})

			this.app.delete(modelName,function(req,res){
				var model = req.body.lookingfor;
				this.entities[modelName].findOneAndRemove(model,{},function(err,doc){
					if(err){
						res.end(err);
					} else {
						res.end("Deleted" + JSON.stringify(doc));
					}
				})
			})

		}
	}

}

function Objectmap(obj,cb){
	for(var key in obj){
		obj[key] = cb(obj[key])
	}

}

module.exports = DatabaseConnection