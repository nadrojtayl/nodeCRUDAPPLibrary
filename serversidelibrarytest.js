var app = require("express")();
var APIHandler = require(__dirname + "/serversidelibrary.js");
var port = 3000;
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

app.listen(3000)