var app = require("express")();
var APIHandler = require(__dirname + "/serversidelibrary.js");
var port = 3000;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var dbHelper = require(__dirname + "/databaseconnection.js");
dbHelper = new dbHelper(app,mongoose)

dbHelper.createSchema({Message:{user:"Jordan",message:"I want a dog"}},"Users have multiple messages");

//fix this so you don't need the new keyword
var APIHandler = new APIHandler(app,port);

var url = "sventrepreneurs";
var api = "https://api.meetup.com/2/events?&sign=true&status=upcoming&photo-host=public&group_urlname=" + url + "&key=5c2f87e243c3b2b547f5a14701370a"

APIHandler.addAPI("Events",api);
APIHandler.addAPI("Google","http://www.google.com");



app.get("/",function(req,res){
	//res.send("Here");
	APIHandler.sendFileWithData(__dirname + "/test.html",res);
})

app.listen(4000)