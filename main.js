"use strict";
var autoipAddress = require(__dirname + "/findIPAddress")
var request = require("request");
var fs = require("fs");
var bodyparser = require("body-parser");

class DBHelper{
	constructor(app,port,ipAddress){
		this.app = app;
		this.port = port;
		if(ipAddress){this.ipAddress = ipAddress} else {this.ipAddress = autoipAddress;}
		this.DBHelper;
	}

	addDBconnection(mongoose){

		this.DBHelper = require(__dirname + "/DBHelper.js");
		this.DBHelper = new this.DBHelper(this.app,this.port,mongoose,this.ipAddress)
		return this.DBHelper;
	}
}

module.exports = DBHelper;