var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test2');
var db = mongoose.connection;

var Street = mongoose.Schema({
    name: String,
});

var House = mongoose.Schema({
    name: String,
    _def: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }
});

var Street = mongoose.model('Street', Street);
var House = mongoose.model('House', House);

// var Blanchard = new Street({ name: 'Blanchard'});

Street.findOne({name:"Blanchard"}).exec(function(err,street){
	if(err){
		console.log(err)
	} else {
		var myHouse = new House({
		    name: "16 Walnut",
		    _def: Street._id    // assign the _id from the person
		  });
		 myHouse.save(function(err,data){
		 	console.log(data);
		 });
	}
})
// Blanchard.save(function(err){
// 	if(err){console.log(err);}
// 	console.log("TYPE",typeof Blanchard._id);
// 	 var myHouse = new House({
// 	    name: "16",
// 	    _def: Blanchard._id    // assign the _id from the person
// 	  });
// 	 myHouse.save(function(err,data){
// 	 	console.log(data);
// 	 });
// })