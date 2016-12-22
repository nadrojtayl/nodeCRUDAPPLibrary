"use strict";

//determine ip address of this computer on network
//you also have the option of enetering own IP as argument

//import request and fs
var bodyparser = require("body-parser");

class API{
	constructor(name,url,getdata,postdata,gettransformer,posttransformer){
		this.clientSideMethodHolder = {};
		this.name = name;
		this.url = url;
		this.gettransformer = gettransformer;
		this.posttransformer = posttransformer;
		this.getdata = getdata; //data if you want to apppend an object, maybe including signature, to *all* get requests
	}

	get(paramObject,res){
		var params = parametrize(paramObject);
		console.log(this.url + params);
		request(this.url + params,function(err,response,body){
			this.gettransformer && this.gettransformer(body);
			console.log(err);
			res.setHeader("Access-Control-Allow-Headers","x-requested-with");
			res.setHeader("Access-Control-Allow-Origin","*");
			res.send(body);
		})
	}

	post(tosend,res){
		res.post(this.url, tosend)
	}
}



class Connection{
	constructor(app,port,ipAddress){
		this.app = app;
		this.APIs = {};
		this.clientMethods = {};
		this.filePaths = {};
		this.port = port;
		this.ipAddress = ipAddress;
	}

	addAPI(name,url,getdata,postdata,transformer){
		if(url.indexOf("?") === -1){
			url = url + "?";
		}
		var newAPI = new API(name,url,getdata,postdata,transformer);
		this.APIs[newAPI.name] = newAPI;

		this.clientMethods["get" + name] = createAjaxReq(url,name,this.port,this.ipAddress);
		// console.log("APIs",this.APIs)

		//connect to App
		this.app.post("/get" + name,function(req,res){
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
		var toinsert = "<script>var server =" + JSON.stringify(this.clientMethods) + ";for(var key in server){server[key] = new Function('params',server[key])}</script>"
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


function createAjaxReq(url,name,port,ipAddress){
	var url = "http://"+ ipAddress + ":" + port + "/get" + name; 
	return "var data = ''; $.ajax({type:'post',url:'"+url+"',async:false,success:function(returnData){data = returnData},data:params}); return data;";
}

function parametrize(obj){
	var str = "";
	for (var key in obj) {
	    if (str != "") {
	        str += "&";
	    }
	    str += key + "=" + encodeURIComponent(obj[key]);
	}
	return "&" + str;
}

module.exports = Connection;

