
var app = require("express")();
var port = 9038;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test3');
var db = mongoose.connection;

var helper =  require(__dirname + "/APIandDBsetup.js");
helper = new helper(app,port);
var APIHandler = helper.APIHelper;
var dbHelper = helper.addDBconnection(mongoose);

dbHelper.createSchema({User:{name:"Mike"},Message:{user:"Mike",message:"I am a dog"},subMessage:{name:"Brian",message:"This is a test"}},{User:["Message","subMessage"],Message:["subMessage"]});

var url = "sventrepreneurs";
var api = "https://api.meetup.com/2/events?&sign=true&status=upcoming&photo-host=public" + "&key=5c2f87e243c3b2b547f5a14701370a"

APIHandler.addAPI("Events",api);
APIHandler.addAPI("Google","http://www.google.com");



app.get("/",function(req,res){
	APIHandler.sendFileWithData(__dirname + "/test.html",res);
})

app.get("/dbtest",function(req,res){
	dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
})


dbHelper.printHelpers();
app.listen(port)
