const {mongoose}= require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');


//to validate id's use ObjectID from mongodb

var id='5a36b22f4cc22b05a4d90171';
// var id='5a37e677e816652a6889dd2d11'; //CastError: Cast to ObjectI
// var id='6a37e677e816652a6889dd2d';//incorrect id

if(!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

Todo.find({
	_id:id
}).then((todos) => {
	console.log('Todos',todos);	//if not found empty array
});

Todo.findOne({
	_id:id
}).then((todo) => {
	console.log('todo',todo);//if not found null
});

Todo.findById(id).then((todo) => {
	if(!todo){
		return console.log('Id not found');
	}
	console.log('todo',todo);
}).catch((e)=>{
	console.log(e);
});

User.findById(id).then((user)=>{
	if(!user) {
		return console.log('User does not exist');
	}
	console.log('User',user);
}).catch((e)=> {
	console.log(e);
})
