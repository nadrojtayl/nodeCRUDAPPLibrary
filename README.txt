


Superfast expressMongoapp: Set up a mongoDB schema and Express server that serves access to your DB models in a single line of code
	-Builds schema
	-Sets up endpoint
	-Uses server side scripting to set up helpers that CRUD your new mongo entities client-side

	-Example: BUILD OUT THE DB AND SERVER FOR A SOCIAL MEDIA APP WITH USERS AND MESSAGES
		-Require the library:
			-var dbHelper = require("superfastmongoapp")
		-Set up the schema by calling the createSchema method
			-dbHelper.createSchema({Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}},{User:["Message"]});
		-Your server will automatically have endpoints that CREATE READ UPDATE and DELETE the models you created
			-Make a get request to the endpoint /getAllMessages to get all messages from your server
				-example
			-Make a get request to the endpoint /getSpecificMessage to get a specific Message
				-getSpecificMessage takes an object and finds an entity in your table with matching attributes
				-Example:
		-Any html files you serve from your server with the "sendFilewithDBMethods" method on the helper automatically has helper functions available to CRUD any endpoints:
			-Example: In your express server, serve files with in response to requests with the sendFileWithDBMethods method

				app.get("/dbtest",function(req,res){
					dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
				})

				-The method takes the html file as its first argument, and the response as its second

			-In your html files, you have a helper to CRUD every entity you created. The helpers are on a globally defined object called DB
				-Example html code:
				<html>
				<head>
					<script>
					    db.addMessage({user:Ben,message:"This is an example"})
					    //The above code posts to your db
					    db.getAllMessages({});
					<script>
				</head>
				<body>
				</body>
				</html>





	FULL SET UP BELOW:



-Many applications use an express server and Mongoose to do the simple action of allowing CRUD operations (CREATE READ UPDATE DELETE) on models in your database. This app gets rid of all that boilerplate needed to accomplish that.

-Superfast express mongoose app:
	-Sets up the schema for your mongoDB database based on a simple declaration of the models you want
	-Sets up endpoints on an express server to CRUD those apps
	-Provides helper functions on html files served from that server, so that you can CRUD your database easily from your server side code
	-with one line of code this library:
		-creates a mongoDB Schema and tables
		-builds express endpoints that enables CRUD operations on the entities in your database
		-insert helpers into all htmls you serve from that server, allowing you to do CRUD operations directly in your client side code


-To set up an app that has users with superfast expressmongoapp follow these 7 steps
	1) npm install express and create an express app instance
		var express = require("express");
		var app = express();
	2) npm install "mongoose" and connect your mongoose instance to your mongo server
		mongoose.connect('mongodb://localhost/test');
	3) Create the helper by requiring this library: 
		var helper =  require(__dirname + "/APIandDBsetup.js");
	4) Connect the helper to your express app by inserting the app object, the port your app will listen on, and (optionally) the IP address of the machine that will host your app
		-with IP address: 
			helper(app,port,"10.8.25.40");
		-without:
			helper(app,port)
	    If you are deploying your app you must insert the ip address of the machine it will be running on.
		If you're creating a test app or running locally its fine to leave IP blank (the library will find your IP address on the network you are on and insert it)

		SuperfastexpressmongoApp needs your IP address because it is going to insert helper methods into the html files you serve with your express server. Those helpers will make ajax requests to your express server and need to know how to refer to it.

	5) Create a new dbHelper by attaching your mongoose instance to the helper
		var dbHelper = helper.addDBconnection(mongoose);
	6)Create a schema for your app by using the createSchema method. This function establishes a mongoDB schema based on a simple command. The first argument to the function sets up the entities you want in your schema: it takes an object, where each key is the name of the entity you want in your schema, and each value is a (nested) object, with key value pairs representing the field names and 

	 This will use mongoose to create all the models you specified in your schema and set up endpoints on your app that CRUD those models

