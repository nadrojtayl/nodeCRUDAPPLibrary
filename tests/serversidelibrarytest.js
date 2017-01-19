
var app = require("express")();
var port = 9038;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test3');
var db = mongoose.connection;

var helper =  require(__dirname + "/main.js");
helper = new helper(app,port);
var dbHelper = helper.addDBconnection(mongoose);

dbHelper.createSchema({User:{name:"Mike"},Message:{user:"Mike",message:"I am a dog"},subMessage:{name:"Brian",message:"This is a test"}},{User:["Message","subMessage"],Message:["subMessage"]});




app.get("/",function(req,res){
	dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
})


dbHelper.printHelpers();
app.listen(port)
