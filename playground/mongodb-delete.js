const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,database) => {
	if(err) {
		return console.log('Unable to connect to the db');
	}
	console.log('Connected to the db');

	const mydb=database.db('TodoApp');

	//deleteMany
	// mydb.collection('Todos').deleteMany({text:'Something to do'}).then((res)=>{
	// 	console.log(res);
	// });

	//deleteOne is similar (it deletes the one it finds)

	//findOneAndDelete

	mydb.collection('Todos').findOneAndDelete({completed:false}).then((deleted)=>{
		console.log(deleted);
	});



	// database.close(); //it is executed right away which can create a problem as db is async code so commented
});