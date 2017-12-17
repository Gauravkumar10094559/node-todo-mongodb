// const MongoClient = require('mongodb').MongoClient;//it helps u connect to a db
const {MongoClient, ObjectID} = require('mongodb');//it helps u connect to a db
//ObjectID makes an id just like the one used in db

// var obj=new ObjectID();
// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,database) => {
	if(err) {
		return console.log('Unable to connect to the db');
	}
	console.log('Connected to the db');

	const mydb=database.db('TodoApp');

	// mydb.collection('Todos').insertOne({
	// 	text:'Something to do',
	// 	completed:false
	// },(err,result)=> {
	// 	if(err) {
	// 		return console.log('Unable to insert todo',err);
	// 	}
	// 	console.log(result.ops);
	// });

	// mydb.collection('Users').insertOne({
	// 	name:'yoyo',
	// 	age:22,
	// 	location:'paris'
	// },(err,result)=>{
	// 	if(err) {
	// 		return console.log('Unable to insert the document',err);
	// 	}
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	database.close();
});