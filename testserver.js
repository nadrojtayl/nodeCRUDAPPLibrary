var app = require("express")();
var bp = require("body-parser");
var request = require('request');

request("http://localhost:9026/deleteMessage").then(function(data){
	console.log(data);
})

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));

app.get("/",function(req,res){
	res.sendFile(__dirname + "/test.html");
})

app.get("/bodytest",function(req,res){
	console.log(req.body);
	res.end("Tested");
})
app.listen(3000);