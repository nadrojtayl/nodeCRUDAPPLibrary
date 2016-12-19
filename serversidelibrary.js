"use strict";
var request = require("request");
var fs = require("fs");
class API{
	constructor(name,url,getdata,postdata,gettransformer,posttransformer){
		this.name = name;
		this.url = url;
		this.gettransformer = gettransformer;
		this.posttransformer = posttransformer;
		this.getdata = getdata; //data if you want to apppend an object, maybe including signature, to *all* get requests
	}
	get(object,res){
		request(this.url,function(err,response,body){
			this.gettransformer && this.gettransformer(body);
			console.log(err);
			res.send(body);
		})
	}

	post(tosend,res){
		res.post(this.url, tosend)
	}
}


//var green = new API();

class Connection{
	constructor(app){
		this.app = app;
		this.APIs = {};
	}

	addAPI(name,url,getdata,postdata,transformer){
		var newAPI = new API(name,url,getdata,postdata,transformer);
		this.APIs[newAPI.name] = newAPI;
		// console.log("APIs",this.APIs)

		//connect to App
		this.app.get("/get" + name,function(req,res){
			var body = req.body;
			newAPI.get(body,res)
		})
		this.app.post("/post" + name),function(req,res){
			var body = req.body
			newAPI.post(body,res)
		}
	}

	sendFileWithData(path,res){
		//console.log(path);
		sendWithClientSideMethods(path,this.APIs,res)()
	}

}

function sendWithClientSideMethods(path,APIobj,res){
	var loadedfiles = {};
	// console.log("PATH",path);
	var path = path;
	var APIobj = APIobj;
	var res = res;
	console.log(res);

	return function(){
		// console.log(path);
		// console.log(APIobj);
		//console.log(res);
		if(loadedfiles[path]){
			return loadedfiles[path]
		}
		var html = fs.readFileSync(path,"utf8");
		var index = html.indexOf("<head>") + 7;
		var APInames = Object.keys(APIobj);
		var helpers = {};
		APInames.forEach(function(name){
			helpers["get" + name] = createAjaxReq(APIobj[name].url,name)		
		})
		var toinsert = "<script>server =" + JSON.stringify(helpers) + " for (var key in server){server[key] = JSON.parse(server[key])}</script>"
		html = html.slice(0,index) + toinsert + html.slice(index)
		res.send(html);
		console.log(typeof html);
	}

}

function createAjaxReq(url,name){
	return "function(){var data = ''; $.ajax({url:"+url+",async:false,success:function(data){data = data})}";
}



class DatabaseConnection{
	constructor(app,mongooseInstance){
		this.app = app;
		this.mongooseInstance = mongooseInstance;
	}

	createSchema(summary){
		var tomake = summary.split(";");

	}

}

module.exports = Connection;

