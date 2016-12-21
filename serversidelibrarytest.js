var app = require("express")();
var APIHandler = require(__dirname + "/serversidelibrary.js");
var port = 3000;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var dbHelper = require(__dirname + "/databaseconnection.js");
dbHelper = new dbHelper(app,mongoose)

dbHelper.createSchema({Message:{user:"Mike",message:"I want a dog"}},"Users have multiple messages");

//dbHelper.helpers.postMessage({user:"Jordan",message:"test"},function(data){
// 	console.log(data);
// })

//console.log(dbHelper.helpers);
// dbHelper.helpers.postMessage({user:"Mike","message":"I am your leader"},function(data){
// 	console.log(data);
// })

dbHelper.helpers.deleteMessage({user:"Mike","message":"this is new"},function(data){
	console.log(data);
})



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

app.listen(8916)