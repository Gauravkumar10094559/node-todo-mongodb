var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,{useMongoClient:true});
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoAppProd',{useMongoClient:true});

module.exports={
	// mongoose:mongoose
	mongoose
};