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
		console.log(this.entities)
		for(var modelName in this.entities){
			this.helpers["get"+ "all" + modelName + "s"] = function(cb){
					this.entities[modelName].find({}).exec(function(err,models){
						cb(JSON.stringify(models))
					})
			}

			this.app.get("all" + modelName + "s",function(req,res){
				this.helpers["get"+ "all" + modelName + "s"](function(data){
					res.end(data);
				})

			})
			

			this.app.get("specific" + modelName,function(req,res){
				var model = req.body.lookingfor;
				//return specified model 

			})

			this.helpers["post"+ modelName] = function(model,cb){
				this.entities[modelName].create(model,function(err,data){
					if(err){toReturn = err} else {
						toReturn = JSON.stringify(data);
					}
					cb(toReturn)
				})
			}

			this.app.post(modelName,function(req,res){
				var model = req.body.lookingfor;
				this.helpers["post" + modelName](model,function(data){
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