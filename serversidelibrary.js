"use strict";

//determine ip address of this computer on network
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( ).en0[1].address.replace("Interfaces ","");

//import request and fs
var request = require("request");
var fs = require("fs");

class API{
	constructor(name,url,getdata,postdata,gettransformer,posttransformer,optionaladdress){
		this.clientSideMethodHolder = {};
		this.name = name;
		this.url = url;
		this.gettransformer = gettransformer;
		this.posttransformer = posttransformer;
		this.getdata = getdata; //data if you want to apppend an object, maybe including signature, to *all* get requests
		this.optionaladdress = this.optionaladdress;
	}

	get(object,res){
		request(this.url,function(err,response,body){
			this.gettransformer && this.gettransformer(body);
			console.log(err);
			res.setHeader("Access-Control-Allow-Headers","x-requested-with");
			res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
			res.send(body);
		})
	}

	post(tosend,res){
		res.post(this.url, tosend)
	}
}



class Connection{
	constructor(app,port){
		this.app = app;
		this.APIs = {};
		this.clientMethods = {};
		this.filePaths = {};
		this.port = port;
	}

	addAPI(name,url,getdata,postdata,transformer){
		var newAPI = new API(name,url,getdata,postdata,transformer);
		this.APIs[newAPI.name] = newAPI;

		this.clientMethods["get" + name] = createAjaxReq(url,name,this.port);
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
		var jquery = '<script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>'; 
		var toinsert = "<script>var server =" + JSON.stringify(this.clientMethods) + ";for(var key in server){server[key] = new Function(server[key])}</script>"
		toinsert = jquery +  toinsert;
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

}


function createAjaxReq(url,name,port){
	var url = "http://"+ networkInterfaces + ":" + port + "/get" + name; 
	return "var data = ''; $.ajax({url:'"+url+"',async:false,success:function(returnData){data = returnData}}); return data;";
}



// class DatabaseConnection{
// 	constructor(app,mongooseInstance){
// 		this.app = app;
// 		this.mongooseInstance = mongooseInstance;
// 	}

// 	createSchema(summary){
// 		var tomake = summary.split(";");

// 	}

// }

module.exports = Connection;

