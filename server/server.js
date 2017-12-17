var express = require('express');
var bodyParser= require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app=express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
	// console.log(req.body);	//go to postman and make a request to localhost:3000/todos and in body raw json send {"texgt":'someting'}

	var todo=new Todo({
		text:req.body.text
	});

	todo.save().then((doc)=> {
		res.send(doc);
	},(e)=> {
		res.status(400).send(e);
	});

});

app.listen(3000,()=>{
	console.log('Server has been started');
})





























// var user = new User({
// 	email:'   gak@gmai.com   '
// });

// user.save().then((doc)=>{
// 	console.log('Saved the user',doc);
// },(e) =>{
// 	console.log('Unable to save the user');
// })



// var newTodo= new Todo({
// 	text:'Cook dinner'
// });

// var newTodo= new Todo({
// 	text:'  feed the cat  '
// })

// newTodo.save().then((doc)=>{
// 	console.log('Saved ToDo',doc);
// },(e)=>{
// 	console.log('Unable to save todo',e);
// })