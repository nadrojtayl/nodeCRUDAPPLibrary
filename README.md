
###superfastmongooseexpress sets up your mongoDB tables, REST endpoints to manipulate your tables, and client side helpers to manipulate your tables -- in a single line of Express code

1. Builds tables based on a simple schema definition
2. Sets up REST API endpoints on an Express server to CRUD the documents in your tables
3. Uses server side rendering to insert helpers that manipulate your mongoDB tables into any html files you serve from your Express server

###Example: To build out the mongo db and server for a social media app with users and messages

Require the library:

```js
-var dbHelper = require("superfastmongooseexpress")
```

Set up your mongoose tables by calling the super simple createSchema method
```js
dbHelper.createSchema({Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}},{User:["Message"]});
```

(CreateSchema takes two arguments. The first argument is an object describing the mongoose tables you want for your project. Keys are the names of tables you want created, values are examples of the kinds of documents that table should hold, represented as objects)

For example, to create a User table where every user has a name you would run:
```js
dbHelper.createSchema({User:{name:"Bobby"}})
```

The optional second argument to createSchema specifies any relationships you want between your tables. Its described in greater depth later on.

When you run createSchema, the library will automatically set up REST endpoints on your Express server that CREATE READ UPDATE and DELETE the documents in the tables you created

```js
-Make a get request to the endpoint /getAllUsers to get all users from your server

-Make a post request to the endpoint /getSpecificUser to get a specific user
```

Here's the full list of endpoints that will be set up for your tables. Replace the name of your table with [tableName]:

```js

site/getAll[tableName]s // -> gets all documents from tables, make a GET request
	(Ex: http://www.testsite/getAllUsers)

site/getSpecific[tableName] // -> gets documents matching object from table, make a post request. The body of your request should be an object representing the document you want returned
	(Ex: http://www.testsite/getSpecificUser, body of request should be {name:"Jerry"} )

site/add[tableName] // -> add document to table, make a post request. The body of your request should be an object representing the new document
	(Ex: http://www.testsite/addUser, body of request({name:"Jerry"} )

site/add[tableName]for[relatedTableName] // -> add documents to a table that has a many to one relationship with another table, make a POST request

//For example, you might have a Message Table where every message is related to a certain User in the User table.

	(Ex: http://www.testsite/addMessageforUser, body of request should be an object with two properties, 'relatedInfo' and 'toPost'. toPost is an object representing the new document to insert. related Info is an object, whose keys are the names of related tables, and whose properties are objects representing the document that the new document you are inserting should be related to. The body to add a message that a certain user posted to the Messages table might look like this:
		var userInfo = {User:{name:"Jordan"}}
		var newmodel = {user:"Jordan",message:"This is an example"}
		set request body to -> {relatedInfo:rf,toPost:newModel};
	)


site/delete[tableName] // -> deletes document from table, make a post request
	(Ex: http://www.testsite/deleteUser, body of request {name:"Jerry"} )


site/update[tableName](object with properties 'find' and 'change') // -> updates single document matching object assigned to "find" to match object assigned to "change"
	(Ex: http://www.testsite/updateUser, body should be {find:{name:"Jerry"},change:{name:"Bob"} )


```

** In addition to setting up REST endpoints, the library will allow you to insert helpers into your html code to manipulate your mongoDB tables. This saves you all the trouble of writing HTTP requests in your client side code to insert,edit or remove documents  **

-To insert helpers that will allow you to manipulate your tables into your html, serve your html files from your server using the "sendFilewithDBMethods" method on the variable name you gave the library:

```

Example: In your express server, serve your homepage html with the sendFileWithDBMethods method:

```js
var app = require("express")();

app.get("/",function(req,res){
	dbHelper.sendFileWithDBMethods(__dirname + "/index.html",res);
})
```

The method takes the path to your html file as its first argument, and the Express response object as its second argument.

In your html files, you now have access to a bunch of helper to manipulate your mongo tables. For each table, there is a helper for getting, creating, editing, and deleting documents. The helpers are on a globally defined object called "db" and are inserted into the html you served in a script tag after the head tag

```html
Example html code to add a message to your messages table from your html:
<html>
<head>
<script>
    db.addMessage({user:Ben,message:"This is an example"})
    //The above code posts to your db
    db.getAllMessages({});
    //This will return all the messages that have been posted
</script>
</head>
<body>
</body>
</html>
```

Now you can focus on your client side code because DB and server setup is done

Heres the full list of all client-side helpers available to you (Replace "modelName" with the exact name of one of the tables you created during schema setup):

```js
db.addmodelName(object) // -> adds document to table 
	(Ex: addUser({name:"Jerry"}))

db.deletemodelName(object) //-> deletes document from table 
	(Ex: deleteUser({name:"Jerry"}))

db.getAllmodelNames() // -> gets all documents from table 
	(Ex: getAllUsers())

db.getSpecificmodelName(object) // -> gets documents matching object from table
	(Ex: getSpecificUser({name:"Jerry"}))

db.updatemodelName(object with properties 'find' and 'change') // -> updates single document matching object assigned to "find" to match object assigned to "change"
	(Ex: updateUser(find:{name:"Jerry"},change:{name:"Bob"})))

```


###LONGER INSTRUCTIONS FOR HOW TO USE THIS LIBRARY:
**Note** If you want to know how to add foreign keys or relationships between tables, skip to the foreign keys section


-To set up your mongoose tables, REST API, and html helpers follow these 7 steps:

1.npm install express and create an express app instance

```js
var express = require("express");
var app = express();
```

2.npm install the "mongoose" ORM and connect your mongoose instance to your mongo server

```js
mongoose.connect('mongodb://localhost/test');
```

3.Require the library and assign it to a variable (e.g. "create a helper")

```js
var helper =  require("superfastmongoExpresssetup");
```

4.Connect the helper to your express app by inserting the app object, the port your app will listen on, and (optionally) the IP address of the machine that will host your app
-with IP address: 
```js
helper(app,port,"10.8.25.40");
```
-without IP address:

```js
helper(app,port)
```

Note: If you are deploying your app you must insert the ip address of the machine it will be running on. If you're creating a test app, or running locally, its fine to leave IP blank (the library will find your IP address on the network you are on and insert it)

SuperfastexpressmongoApp needs your IP address to insert helper methods into the html files you serve from your express server.

5.Create a new dbHelper by attaching your mongoose instance to the helper
```js
var dbHelper = helper.addDBconnection(mongoose);
```

6.Create your mongoDB tables by using the createSchema method. This function establishes a mongoDB schema based on a simple command. The first argument to the function describes the tables you want in your schema: you should pass an object, where each key is the name of the table you want in your schema, and each value is a (nested) object that is an example of the kinds of documents you want that table to hold.

Superfastmongoexpress will read the types of objects you want stored in the columns in your tables and use that information to set up new mongo tables

Example:
Create a users table and a messages table, where Users have a name and messages have a message and a time.

```js
dbHelper.createSchema({
	Message: {time:"10 AM",message:"This is an example"},
	User: {name:"Brian"}
});
```

####FOREIGN KEYS: 

Use the (optional) second argument to createSchema to establish relationships between your tables. You do not need to specify foreignkeys or relationships in the first argument. For the second argument, input an object, where each key is the name of one of the table you set up, and the value is an array containing the names of the other tables you want that table to have a one to many connection to.

For example, if your app has Users and Messages, each User probably has many Messages. You may want to establish a relationship between the User and Messages table, so you can easily find all messages from a certain User. In Mongoose, you accomplish this by putting a foreign key on each message that represents the id of the User that posted the message.

Its very easy to accomplish this using superfastmongoexpress. If you want each Message to contain an ID for the user who wrote the message, create your schema like this:

```js
var schema = {Message:{user:"Mike",message:"I am a dog"},User:{name:"Mike"}};

var relationships = {User:["Message"]}

dbHelper.createSchema(schema,relationships);
```
As stated, in the relationships object, make a key for every table that you want to have a one to many relationship with another table. The value for that key should be an array containing the names, as strings, of all tables that the key table should have a relationship to.

If you wanted users to be able to post submessages in response to messages, you might make your schema like this.
```js
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
```
This way each submessage will have reference to both the User who posted it and the message it is a response to.

See below to see how to post documents to tables that have relationships to other tables.

7.That's it. When you run your server, the helper will create your schema, and create endpoints to Create, Read, Update and Delete the documents in each table you created. 

You can also serve files in your express app using the db.sendFileWithDBMethods method to make manipulating your database from your client side code extremely easy. 

Serve your files using db.sendFileWithDBMethods to insert helpers into your html code toCREATE, READ, UPDATE AND DELETE the documents in the tables you created.

Example of serving a file using sendFileWithDBMethods:

```js
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
```

The sendFileWithDBMethods function takes the absolute path to an html file as its first argument, and the response as its second.

Then, in test.html, you will have access to a bunch of helper functions on an object called "db" to manipulate documents in all your tables. For example, to add Messages to your database, you could write client code like this:


```html
<html>
	<head>
		<script>
		    db.addMessage({user:Ben,message:"This is an example"})
		    	//The above code posts to your db
		    db.getAllMessages({});
		    	//This will return all the messages that have been posted
		</script>
	</head>
	<body>
	</body>
</html>
```

You could do something like this to allow your user to send a message by entering text in an input and clicking a button:

```html
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
```

In your html files, the helpers for each table will be available on an object called "db." Here's the full list of helper functions. You will have one of these function for each table (replace [tableName] with the name of your table) you created:

```js
db.add[tableName](object) // -> adds document to table 
	(Ex: addUser({name:"Jerry"}))

db.delete[tableName](object) // -> deletes document from table 
	(Ex: deleteUser({name:"Jerry"}))

db.getAll[tableName]s() // -> gets all documents from table 
	(Ex: getAllUsers())

db.getSpecific[tableName](object) // -> gets documents matching object from table
	(Ex: getSpecificUser({name:"Jerry"}))

db.update[tableName](object with properties 'find' and 'change') // -> updates single document matching object assigned to "find" to match object assigned to "change"
	(Ex: updateUser(find:{name:"Jerry"},change:{name:"Bob"})))
```

INSERTING TO TABLES WITH FOREIGN KEYS

If you specified a table as having a many to one relationship to another table, the library provides you an extra helper to add a new document to that table while specifying what documents in other tables it should be associated with. For example, if you created a Messages table for messages posted by Users, you need a way to post your Messages while specifiying what User is posting it.

This method is called "db.add[tableName]for[relatedTableName]"

For the example above, if you created a Users table and a Messages table, the function to add a Message for a certain User would be called db.addMessageforUser

The function takes as an argument an object with two keys:

relatedInfo: An object whose keys are the names of the tables your table is related to (for example "User") and whose values are objects representing the document in that table you want to associate your new document with

toPost: An object representing the new document to add to the table

So, for example, to post a new Message to the Messages table associated with the User Ben, you do:

```html
	<script>
		var rf = {User:{name:"Jordan"}}

		var newmodel = {user:"Jordan",message:"This is an example"};

		db.addMessageforUser({relatedInfo:rf,toPost:newModel});
	</script>
```

If the table is related to more than one table, than the method is called db.add[tableName]for[relatedTable1]and[relatedTable2]and[relatedTable3]...

So, if you have a subMessage table, where each subMessage is associated with a certain User and a Message, the client side function to add a subMessage is called.
```js
	db.addsubMessageforUserandMessage
```
And to add a submessage you could run this code
```html
	<script>
		var relatedUser = {User:{name:"Jordan"}}
		var relatedMessage = {user:"Jordan",message:"This is the main message"}
		var newsubComment = {user:"Jordan",message:"This is an example"};

		db.addsubMessageforUserandMessage({
			relatedInfo{User:relatedUser,Message:relatedMessage},
			toPost:newsubComment
		})
	</script>
```

To get all the documents in a table related to a document in another table,	you need to get the mongoID (always called _id) of the document from one table using the getSpecific[tableName] function, and then get all the documents from another table that have that ID as their _[tableName] property.	

For example, to get all the Messages a specific User posted, you would:

1)Find that user's ID using getSpecificUser
```js
	//ex: db.getSpecificUser({name:Jordan}) -> [{name:Jordan,_id:"1234"}];
	// var id = db.getSpecificUser({name:Jordan})._id;
```

2)Use getSpecificMessage to find Messages who's _User property matches that id

```js
	//db.getSpecificMessage({_User:id}) -> All messages posted by Jordan
```

Documents in a table in a many to one relationship with another table--for example "relatedTable" will always have a property called _[relatedTableName]. That's what you use to filter for documents related to a specific document.

For example, if you have an ingredients table where each ingredient is related to a recipe, the recipe ID will be stored on a property called _Recipe on each ingredient. So to find all the ingredients in a certain Recipe you would use the same process as above, but you would getSpecificRecipe and check if _Recipe matched the id of the recipe whose ingredients you were looking for.

At any point, from your express side code you can run the printHelper method to see all the helpers that will be available to you on the client side

```js
//Example:
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test3');

var db = mongoose.connection;

var helper =  require(__dirname + "/APIandDBsetup.js");

helper = new helper(app,port);

var dbHelper = helper.addDBconnection(mongoose);

dbHelper.printHelpers();

//the above will print all the helpers
```



//EXAMPLE OF CLIENT SIDE AND SERVER SIDE CODE TO SET UP CHAT MESSAGING APP USING SUPERFASTMONGOEXPRESS

```js

**express server side code

var app = require("express")();
var port = 9038;

var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test3');

var db = mongoose.connection;

var helper =  require("superfastmongoexpress");

helper = new helper(app,port);

var dbHelper = helper.addDBconnection(mongoose);

dbHelper.createSchema(
	{
		User:{name:"Mike"},
		Message:{user:"Mike",message:"I am a dog"},
		subMessage:{name:"Brian",message:"This is a test"}
	},
	{
		User:["Message","subMessage"],
		Message:["subMessage"]
	}
);

app.get("/",function(req,res){
	dbHelper.sendFileWithDBMethods(__dirname + "/test.html",res);
})

app.listen(port);
```

```html
**html code

<html>
	<head>
		<script
	  src="https://code.jquery.com/jquery-3.1.1.js"
	  integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA="
	  crossorigin="anonymous"></script>
	  <script>

	  </script>
	</head>
	<body>
		<div>
			<label>Select User</label>
			<select id ="selector">
			</select>
		</div>
		<div>
			<label> Send Message </label>
			<input type="text" id="message"></input>
			<button onclick = "send()">Send</button>
			<div id="messageHolder"></div>
			<button onclick = "refresh()">Refresh Messages</button>
		</div>
		<script>
			
			//the code block below uses getAllUsers to append all users to a dropdown list so that the user can select what user they want to post as
			db.getAllUsers().forEach(function(user){
				var userContainer = $("#selector");
				var newOpt = $("<option></option>")

				userContainer.append("<option val ="+ user.name + ">"+user.name+ "</option>")
			})

			//the 'send' function below uses the addMessageforUser helper function to add a new message for the selected user into the database
			function send(){
				var user = $("#selector").val();
				var messagetext = $("#message").val();
				db.addMessageforUser({relatedInfo:{User:{name:user}},toPost:{user:user,message:messagetext}});
			}

			//the 'refresh' function uses the getAllMessages function to get All the messages in the database
			//uses jquery to append to a div on the page
			function refresh(){
				var messagecontainer = $("#messageHolder")
				messagecontainer.empty();
				db.getAllMessages().forEach(function(messageObj){
					var toAdd = $("<p>"+ messageObj.user+" :"+ messageObj.message + "</p>")
					messagecontainer.append(toAdd);
				})
			}
		</script>
	</body>
</html>
```