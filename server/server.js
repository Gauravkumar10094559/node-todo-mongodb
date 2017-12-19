// var env=process.env.NODE_ENV || 'development';
// console.log('env========',env);
// //setting up the db for diff env

// if(env==='development') {
// 	process.env.PORT=3000;
// 	process.env.MONGODB_URI='mongodb://localhost:27017/ToDoAppProd';
// } else 	{
// 	process.env.PORT=3000;
// 	process.env.MONGODB_URI='mongodb://localhost:27017/ToDoAppProdTest';
// }

require('./../config/config');
const _=require('lodash');
const express = require('express');
const bodyParser= require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

//process.env.NODE_ENV === 'production','development','test'

// "test":"export NODE_ENV=test || SET \"NODE_ENV=test\"     "

//to tell heroku to start the app add the script "start" in the package.json file
// to have the version of node on the heroku as the one you have on machine add script "engines" 
var app=express();

app.use(bodyParser.json());

app.get('/todos',(req,res)=>{
	Todo.find().then((todos)=>{
		res.send({
			todos//do it like this,easier to extend later
		})
	},(e)=>{
		res.status(400).send(e);
	})
})

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


app.get('/todos/:id',(req,res)=> {
	var id=req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo)=>{
		if(!todo) {
			return res.status(404).send();
		}
		return res.status(200).send({todo});//res.send(todo); avoid this
	}).catch((e)=> {
		return res.status(400).send();
	})

});

app.delete('/todos/:id',(req,res) => {
	var id= req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo) {
			res.status(404).send();
		}
			res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});


app.patch('/todos/:id',(req,res)=> {

	var id= req.params.id;
	var body= _.pick(req.body,['text','completed']);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt= new Date().getTime();
	} else {
		body.completed=false;
		body.completedAt=null;
	}

	Todo.findByIdAndUpdate(
		id,
		{
			$set:body
		},
		{
			new:true
		}
	).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});

	}).catch((e)=> {
		res.status(400).send();
	});

});


var PORT = process.env.PORT||3000;

app.listen(PORT,()=>{
	console.log(`Started up at port ${PORT}`);
})

module.exports={
	app
};

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