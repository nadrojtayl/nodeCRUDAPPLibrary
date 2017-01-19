"use strict";
var autoipAddress = require(__dirname + "/findIPAddress")
var request = require("request");
var fs = require("fs");
var bodyparser = require("body-parser");

class APIandDBHelper{
	constructor(app,port,ipAddress){
		this.app = app;
		this.port = port;
		if(ipAddress){this.ipAddress = ipAddress} else {this.ipAddress = autoipAddress;}
		this.APIHelper = new require(__dirname + "/APIHelper");
		this.APIHelper = new this.APIHelper(app,port,this.ipAddress);
		this.DBHelper;
	}

	addDBconnection(mongoose){

		this.DBHelper = require(__dirname + "/DBHelper.js");
		this.DBHelper = new this.DBHelper(this.app,this.port,mongoose,this.ipAddress)
		return this.DBHelper;
	}
}

module.exports = APIandDBHelper;