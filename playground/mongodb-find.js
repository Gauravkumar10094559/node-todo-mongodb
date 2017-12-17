const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,database) => {
	if(err) {
		return console.log('Unable to connect to the db');
	}
	console.log('Connected to the db');

	const mydb=database.db('TodoApp');

	// mydb.collection('Todos')
	// 						// .find()//it returns a cursor to the documents as the docs could be a couple of thousands
	// 						.find({
	// 							// completed:false
	// 							// _id:"5a368ec9e0f96406bc8f6102"//it won't work
	// 							_id:ObjectID('5a368ec9e0f96406bc8f6102')
	// 						})
	// 						.toArray()//and that cursor has some methods which in this case will convert to array (it does exactly what you might think it does)
	// 						.then((docs)=>{
	// 							console.log('Todos');
	// 							console.log(JSON.stringify(docs,undefined,2));
	// 						},(err)=>{
	// 							console.log('Unable to fetch todos',err);
	// 						});


	// mydb.collection('Todos')
	// 						.find()
	// 						.count()
	// 						.then((count)=>{
	// 							console.log('Todos count:',count);
	// 						},(err)=>{
	// 							console.log('Unable to fetch todos',err);
	// 						});

	   mydb.collection('Users')
	   						  .find({
	   						  	name:'gaurav'
	   						  })
	   						  .toArray()
	   						  .then((docs)=>{
	   						  	console.log('Users',JSON.stringify(docs,undefined,2));
	   						  },(err)=>{
	   						  	console.log('Unable to fetch the users',err);
	   						  })

	// database.close(); //it is executed right away which can create a problem as db is async code so commented
});