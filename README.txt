!!!!

SUPERFASTMONGOEXPRESS: Abstract all the boilerplate needed to set up an express-mongo server into a single line of code

!!!!!
Superfastmongoexpress sets up your mongoDB tables and an Express server that serves access to your tables in a single line of code
	-Builds models based on a simple schema definition
	-Sets up endpoints on an Express server to CRUD all your tables
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
		**Note** If you want to know how to add foreign keys or relationships between tables, skip to the foreign keys section on line 95


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

	FOREIGN KEYS: Use the (optional) second argument to createSchema to establish relationships between your tables. You do not need to specify foreignkeys or relationships in the first argument. For the second argument, input an object, where each key is the name of a table, and each value is an array containing the names of the other tables you want it to have a one to many connection to.

	For example, if your app has Users and messages, each User probably has many Messages. You may want to establish a relationship between the User and Messages table so you can easily find all messages from a certain User. In Mongoose, you accomplish this by putting a foreign key on each message that represents the id of the User that posted the message.

	Its very easy to accomplish this using this library. If you want each Message to contain an ID for the user who wrote the message, create your schema like this:

		var schema = {Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}};
		var relationships = {User:["Message"]}

		dbHelper.createSchema(schema,relationships);

	As stated, in the relationships object, make a key for every table that you want to have a one to many relationship with another table. The value for that key should be an array containing the names, as strings, of all tables that the key table should have a relationship to.

	If you wanted users to be able to post submessages in response to messages, you might make your schema like this.

	var schema = {
		Message:{user:"Mike",message:"I am a dog"},
		User:{name:"Mike"},
		subMessage:{message:"This is a sub-comment"}
	};

	var relationships = {
		User:["Message","subMessage"],
		Message:["subMessage"]
	}

	dbHelper.createSchema(schema,relationships);

	This way each submessage will have reference to both the User who posted it and the message it is under.

	See below to see how to post documents to tables that have relationships to other tables.

	7)That's it. When you run your server, the helper will create your schema, and create endpoints to Create, Read, Update and Delete the documents in each table you created. 

	You can also serve files in your express app using the db.sendFileWithDBMethods method to make manipulating your database from your client side code extremely easy. 

	**
	 When you serve your files using db.sendFileWithDBMethods, you will have access in your html code to a set of helpers that-- for each of your new tables-- will CREATE, READ, UPDATE AND DELETE documents in that table**:

	Example of serving a file using sendFileWithDBMethods:
		var dbHelper = require("superfastmongoapp")
		var mongoose = require("mongoose");
		mongoose.connect('mongodb://localhost/test3');
		var dbHelper = helper.addDBconnection(mongoose);
		var schema = {
			User:{name:"Mike"},
			Message:{user:"Mike",message:"I am a dog"},
			subMessage:{name:"Brian",message:"This is a test"
		};
		var relationships = {User:["Message","subMessage"],Message:["subMessage"]};

		dbHelper.createSchema(schema,relationships);


		app.get("/",function(req,res){
			dbHelper.sendFileWithDBMethods(__dirname + "/homepage.html",res);
		})

	The secndFileWithDBMethods function takes the absolute path to an html file as its first argument, and the response as its second.

	Then, in test.html, you will have access to a bunch of helper functions on an object called "db" to CRUD every document in your table. For example, to add Messages to your database, you could write client code like this:

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

	You could do something like this to allow your user to send a message by entering text in an input and clicking a button:
	<html>
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

	In your html files, the helpers for each table will be available on an object called "db." Here's the full list of helper functions. You will have one of these function for each table (replace [tableName] with the name of your table) you created:

			db.add[tableName](object) -> adds document to table 
				(Ex: addUser({name:"Jerry"}))
			db.delete[tableName](object) -> deletes document from table 
		   		(Ex: deleteUser({name:"Jerry"}))
			db.getAll[tableName]s() -> gets all documents from table 
				(Ex: getAllUsers())
			db.getSpecific[tableName](object) -> gets documents matching object from table
				(Ex: getSpecificUser({name:"Jerry"}))
			db.update[tableName](object with properties 'find' and 'change') -> updates single document matching object assigned to "find" to match object assigned to "change"
			 	(Ex: updateUser(find:{name:"Jerry"},change:{name:"Bob"})))

	INSERTING TO TABLES WITH FOREIGN KEYS
