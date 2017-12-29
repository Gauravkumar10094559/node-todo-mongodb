const {ObjectID} = require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}= require('./../../models/user');
const jwt= require('jsonwebtoken');

var todos=[
	{
		_id:new ObjectID(),
		text:'First test todo'
	},
	{
		_id:new ObjectID(),
		text:'Second test todo',
		completed:true,
		completedAt:22
	}
];

const populateTodos=(done)=>{	 

	Todo.remove({})
		.then(()=>{	 
			return Todo.insertMany(todos);	//insertMany wont hash the password because it doesn't run the middlewares
		})
		.then(()=> done());	 
}


const userOneId=new ObjectID();
const userTwoId= new ObjectID();

const users=[{
	_id:userOneId,
	email:'gaurav@ex.com',
	password:'useronepass',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
	}]
},{
	_id:userTwoId,
	email:'mick@zi.com',
	password:'usertwopass'
}];

const populateUsers=(done) => {
	User.remove({}).then(()=> {
		var userOne=new User(users[0]).save();
		var userTwo=new User(users[1]).save();

		return Promise.all([userOne,userTwo])
	}).then(()=> done());
}


module.exports={todos,populateTodos,populateUsers,users};