
var app = require("express")();
var port = 9038;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test2');
var db = mongoose.connection;

var helper =  require(__dirname + "/APIandDBsetup.js");
helper = new helper(app,port);
var APIHandler = helper.APIHelper;
var dbHelper = helper.addDBconnection(mongoose);

dbHelper.createSchema({User:{name:"Mike"},Message:{user:"Mike",message:"I am a dog"}},{User:["Message"]});

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

// dbHelper.entities.User.findOne({name:"Jordan"}).exec(function(err,data){
// 	console.log("TYPEE",typeof data._id);
// 	var message = new dbHelper.entities.Message({user:"Jordan",message:"Hey",_User: data._id});
// 	message.save(function(err,data){
// 		console.log("ERR",err);
// 		console.log("DATA",data);
// 	});
// })
dbHelper.helpers.addMessageforUser({User:{name:"Jordan"}},{user:"Jordan",message:"Sup"},function(data){console.log(data);});


dbHelper.helpers["updateMessage"]({user:"Test",message:"Updated2"},{user:"Test",message:"Updated3"},function(data){console.log(data)});

app.listen(port)
