const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,database) => {
	if(err) {
		return console.log('Unable to connect to the db');
	}
	console.log('Connected to the db');

	const mydb=database.db('TodoApp');

	//findOneAndUpdate(filter, update, options, callback) if no callback is provided then a promise is returned

	mydb.collection('Users').findOneAndUpdate({
		_id:ObjectID("5a3697b2ff6784d30c96f1f5")
	},{
		$set:{
			name:'mickey'
		},
		$inc:{
			age:2
		}
	}, {
		returnOriginal:false
	}).then((result)=>{
		console.log(result);
	})



	// database.close(); //it is executed right away which can create a problem as db is async code so commented
});