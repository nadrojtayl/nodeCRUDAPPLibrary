"use strict";


class APIandDBHelper{
	constructor(app,port){
		this.app = app;
		this.port = port;
		this.APIHelper = new require(__dirname + "/APIHelper");
		this.APIHelper = new this.APIHelper(app,port);
		this.DBHelper;
	}

	addDBconnection(mongoose){

		this.DBHelper = require(__dirname + "/DBHelper.js");
		this.DBHelper = new this.DBHelper(this.app,this.port,mongoose)
		return this.DBHelper;
	}
}

module.exports = APIandDBHelper;