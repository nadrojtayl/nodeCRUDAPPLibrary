var app = require("express")();
var port = 9037;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var helper =  require(__dirname + "/APIandDBsetup.js");
helper = new helper(app,port);
var APIHandler = helper.APIHelper;
var dbHelper = helper.addDBconnection(mongoose);


dbHelper.createSchema({Message:{user:"Mike",message:"I am a dog"}},"Users have multiple messages");


console.log(dbHelper.helpers);
dbHelper.helpers.postMessage({user:"Mikael","message":"this is new"},function(data){
	console.log(data);
})


var url = "sventrepreneurs";
var api = "https://api.meetup.com/2/events?&sign=true&status=upcoming&photo-host=public" + "&key=5c2f87e243c3b2b547f5a14701370a"

APIHandler.addAPI("Events",api);
APIHandler.addAPI("Google","http://www.google.com");



app.get("/",function(req,res){
	//res.send("Here");
	APIHandler.sendFileWithData(__dirname + "/test.html",res);
})

app.get("/dbtest",function(req,res){
	dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
})

app.listen(port)