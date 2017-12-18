const request= require('supertest');
const {ObjectID} = require('mongodb');
const {app}=require('./../server');
const {Todo}=require('./../models/todo');

var todos=[
	{
		_id:new ObjectID(),
		text:'First test todo'
	},
	{
		_id:new ObjectID(),
		text:'Second test todo'
	}
];

beforeEach((done)=>{	//to have the same db every time we test
	// Todo.remove({}).then(()=>done());//for just post routes
	Todo.remove({})
					.then(()=>{	//first remove all
						return Todo.insertMany(todos);	//then add dummy data
					})
					.then(()=> done());	//and then finish with done()
});

describe('POST /todos',() => {
	it('should create a new todo',(done) => {	//saving to db is async so done

	var text='Test todo text';

	request(app) 
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);	//the response
		})
		.end((err,res)=>{
			if(err) {
				return done(err);
			}
			Todo.find({text}).then((todos)=>{	//the one stored in db
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			})
			.catch((e)=> done(e));
		});
	});

	it('should not create todo with invalid body data',(done)=> {

		var text ='';
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err,res)=>{
				if(err) {
					return done(err);
				}
				Todo.find().then((todos)=>{
					expect(todos.length).toBe(2);
					done();//dont forget to add this otherwise the will fail(timeout error)
				})
				.catch((err)=> done(err));
			});

	});


});

describe('GET /todos',()=>{
	it('should get all todos',(done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2);//beforeEach clears everything before each it function runs
			})
			.end(done);
	});
});

describe('GET /todos/:id',()=> {
	it('should return todo doc',(done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`) //string return the 24 byte hex string representation.
			.expect(200)
			.expect((res)=> {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if not found',(done) => {
		var hexId=new ObjectID().toHexString();
		request(app)
			.get('/todos/'+hexId+'')
			.expect(404)
			// .expect((res) =>{
			// 	expect(res.body.length).toBe(undefined);
			// })
			.end(done);
	});

	it('should return 404 for non-object ids',(done) => {
		request(app)
			.get('/todos/6a37e677e816652a6889dd2d11')
			.expect(404)
			.end(done);
	})
});