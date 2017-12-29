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
 
require('./config/config');
const _=require('lodash');
const express = require('express');
const bodyParser= require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

//process.env.NODE_ENV === 'production','development','test'

// "test":"export NODE_ENV=test || SET \"NODE_ENV=test\"     "

//to tell heroku to start the app add the script "start" in the package.json file
// to have the version of node on the heroku as the one you have on machine add script "engines" 
var app=express();

app.use(bodyParser.json());

app.get('/todos',authenticate,(req,res)=>{
	Todo.find({
		_creator:req.user._id
	}).then((todos)=>{
		res.send({
			todos//do it like this,easier to extend later
		})
	},(e)=>{
		res.status(400).send(e);
	})
})

app.post('/todos',authenticate,(req,res)=>{
	// console.log(req.body);	//go to postman and make a request to localhost:3000/todos and in body raw json send {"texgt":'someting'}

	var todo=new Todo({
		text:req.body.text,
		_creator:req.user._id
	});

	todo.save().then((doc)=> {
		res.send(doc);
	},(e)=> {
		res.status(400).send(e);
	});

});


app.get('/todos/:id',authenticate,(req,res)=> {
	var id=req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({
		_id:id,
		_creator:req.user._id
	}).then((todo)=>{
		if(!todo) {
			return res.status(404).send();
		}
		return res.status(200).send({todo});//res.send(todo); avoid this
	}).catch((e)=> {
		return res.status(400).send();
	})

});

app.delete('/todos/:id',authenticate,(req,res) => {
	var id= req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOneAndRemove({
		_id:id,
		_creator:req.user.id
	}).then((todo)=>{
		if(!todo) {
			return res.status(404).send();
		}
			res.status(200).send({todo});
	}).catch((e) => {
		return res.status(400).send(e);
	});
});


app.patch('/todos/:id',authenticate,(req,res)=> {

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

	Todo.findOneAndUpdate(
		{
			_id:id,
			_creator:req.user.id
		},
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

app.post('/users',(req,res) => {

	var body=_.pick(req.body,['email'],['password']);
	// var user = new User({
	// 	email:body.email,
	// 	password:body.password
	// });

	var user = new User(body);

	user.save().then(()=> {
		// console.log(user);
		//now when the user signs up you need to 
		//give them the token
		//User can have custom model methods
		//ex. User.findByToken
		//user can have instance methods(this one is
		// on every document)
		//ex. user.generateAuthToken
		// console.log('user-0',user);
		return user.generateAuthToken();
		// res.send({user});
	}).then((token)=> {

		res.header('x-auth',token).send(user);
	}).catch((e)=>{
		res.status(400).send(e);
	})

});


//MIDDLEWARE



//PRIVATE ROUTE

app.get('/users/me',authenticate,(req,res) => {
	res.send(req.user);


	// var token=req.header('x-auth');

	// //model method
	// User.findByToken(token).then((user)=> {
	// 	if(!user) {
	// 		return Promise.reject();
	// 	}
	// 	res.send(user);
	// }).catch((e) => {
	// 	res.status(401).send();
	// });
});

//POST /users/login

app.post('/users/login',(req,res)=> {

	var body=_.pick(req.body,['email'],['password']);

	User.findByCredentials(body.email,body.password).then((user)=>{
		// console.log(user)s;
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth',token).status(200).send(user);
		})
	}).catch((e)=> {
		res.status(400).send('err');
	});

	// User.findOne({email:body.email}).then((user)=> {
	// 	bcrypt.compare(body.password,user.password,(err,result)=> {
	// 		if(err) {
	// 			return res.status(404).send();
	// 		}
	// 		return res.status(200).send(user);
	// 	})
	// },(e)=> {
	// 	return res.status(404).send();
	// });

});


app.delete('/users/me/token',authenticate,(req,res)=> {
	req.user.removeToken(req.token).then(()=> {
		res.status(200).send();
	},()=>{
		res.status(400).send();
	})
})



const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

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