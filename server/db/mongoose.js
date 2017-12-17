var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoAppProd',{useMongoClient:true});

module.exports={
	// mongoose:mongoose
	mongoose
};