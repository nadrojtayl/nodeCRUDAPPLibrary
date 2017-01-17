


Superfast expressMongoapp: Set up your mongoDB models and an Express server that serves access to your models in a single line of code
	-Builds models based on a simple example of the schema you want
	-Sets up endpoints on an Expres server to CRUD your
	-Uses server side scripting to set up helpers that CRUD your new mongo entities client-side

	-Example: BUILD OUT THE DB AND SERVER FOR A SOCIAL MEDIA APP WITH USERS AND MESSAGES
		-Require the library:
			-var dbHelper = require("superfastmongoapp")
		-Set up the schema by calling the createSchema method
			-dbHelper.createSchema({Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}},{User:["Message"]});
			-The first argument to schema should be an object. Keys are the names of tables you want created, values are examples of the kinds of objects that table should hold
			-To create a User table with a name column you would run dbHelper.createSchema({User:{name:"Bobby"}})
		-Your server will automatically have endpoints that CREATE READ UPDATE and DELETE the models you created
			-Make a get request to the endpoint /getAllMessages to get all messages from your server
			-Make a post request to the endpoint /getSpecificMessage to get a specific Message
		-Any html files you serve from your server with the "sendFilewithDBMethods" method on the helper automatically has helper functions available to CRUD any endpoints:
			-Example: In your express server, serve all files in response to requests with the sendFileWithDBMethods method

				app.get("/dbtest",function(req,res){
					dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
				})

				-The method takes the html file as its first argument, and the response as its second

			-In your html files, you now have a helper to CRUD every entity you created. The helpers are on a globally defined object called "db"
				-Example html code to add a message from the client side:
				<html>
				<head>
					<script>
					    db.addMessage({user:Ben,message:"This is an example"})
					    //The above code posts to your db
					    db.getAllMessages({});
					    //This will return all the messages that have been posted
					<script>
				</head>
				<body>
				</body>
				</html>
		-Focus on your client side code because DB and server setup is done
		-Here's the full list of all client-side helpers available to you (Replace "modelName" with the name of any of the models you created during schema setup):

			db.addmodelName(object) -> adds document to table 
				(Ex: addUser({name:"Jerry"}))
			db.deletemodelName(object) -> deletes document from table 
		   		(Ex: deleteUser({name:"Jerry"}))
			db.getAllmodelNames() -> gets all documents from table 
				(Ex: getAllUsers())
			db.getSpecificmodelName(object) -> gets documents matching object from table
				(Ex: getSpecificUser({name:"Jerry"}))
			db.updatemodelName(object with properties 'find' and 'change') -> updates single document matching object assigned to "find" to match object assigned to "change"
			 	(Ex: updateUser(find:{name:"Jerry"},change:{name:"Bob"})))
			

	LONGER INSTRUCTIONS:


-Many applications use an express server and Mongoose to do the simple action of allowing CRUD operations (CREATE READ UPDATE DELETE) on models in your database. This library gets rid of all the boilerplate.


-To set up an app follow these 7 steps
	1) npm install express and create an express app instance
		var express = require("express");
		var app = express();
	2) npm install "mongoose" and connect your mongoose instance to your mongo server
		mongoose.connect('mongodb://localhost/test');
	3) Create the helper by requiring this library: 
		var helper =  require("superfastmongoExpresssetup");
	4) Connect the helper to your express app by inserting the app object, the port your app will listen on, and (optionally) the IP address of the machine that will host your app
		-with IP address: 
			helper(app,port,"10.8.25.40");
		-without:
			helper(app,port)
	    Note: If you are deploying your app you must insert the ip address of the machine it will be running on. If you're creating a test app, or running locally, its fine to leave IP blank (as the library will find your IP address on the network you are on and insert it)

		SuperfastexpressmongoApp needs your IP address because it is going to insert helper methods into the html files you serve from your express server.

	5) Create a new dbHelper by attaching your mongoose instance to the helper
		var dbHelper = helper.addDBconnection(mongoose);
	6)Create a schema for your app by using the createSchema method. This function establishes a mongoDB schema based on a simple command. The first argument to the function sets up the entities you want in your schema: pass an object, where each key is the name of the table you want in your schema, and each value is a (nested) object and an example of the kinds of objects you want that table to hold.

	Example:
	Create a users table and a messages table, where Users have a name and messages have a message and a time.
		dbHelper.createSchema({
			Message:{time:"10 AM",message:"This is an example"},
			User:{name:"Brian"}
		});

	Use the (optional) second argument to createSchema to establish relationships between your tables. Input an object, where each key is the name of a table, and each value is an array containing the names of the other tables you want it to have a connection to.

	For example, if you want each Message to contain an ID for the user who wrote the message, create your schema like this:

		dbHelper.createSchema({Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}},{User:["Message"]});

	This will use mongoose to insert an array onto each User that holds the id of Messages that User posted. You just need to remember to insert the id of each message that User posts into the User array.



	7)That's it. When you run your server, the helper will create your schema, and create endpoints to Create, Read, Update and Delete the documents in each table you created. 

	To make your database entities available to your client side code, serve files in your express app with the db.sendFileWithDBMethods method. This will provide access in your html to each of the CRUD helpers:

	Example:

		app.get("/dbtest",function(req,res){
			dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
		})

	Then, in test.html, you could use code like this to add a user:

		<html>
			<head>
				<script>
				    db.addMessage({user:Ben,message:"This is an example"})
				    //The above code posts to your db
				    db.getAllMessages({});
				    //This will return all the messages that have been posted
				<script>
			</head>
			<body>
			</body>
		</html>

	You could also put this in a button to allow your user to send a message:
	html>
		<head>
			
		</head>
		<body>
			<input id="message"></input>
			<button onclick = "postMessage()">Add message</button>
			<script>
			function postMessage(){
				//get message using jquery
				var messageString = $("#message").text()

				//post using db helper
			    db.addMessage({user:"Testuser",message:messageString})
			 }
			<script>
		</body>
	</html>

	Here's the full list of helper functions. They're all on a global object called "db":

			db.addmodelName(object) -> adds document to table 
				(Ex: addUser({name:"Jerry"}))
			db.deletemodelName(object) -> deletes document from table 
		   		(Ex: deleteUser({name:"Jerry"}))
			db.getAllmodelNames() -> gets all documents from table 
				(Ex: getAllUsers())
			db.getSpecificmodelName(object) -> gets documents matching object from table
				(Ex: getSpecificUser({name:"Jerry"}))
			db.updatemodelName(object with properties 'find' and 'change') -> updates single document matching object assigned to "find" to match object assigned to "change"
			 	(Ex: updateUser(find:{name:"Jerry"},change:{name:"Bob"})))
