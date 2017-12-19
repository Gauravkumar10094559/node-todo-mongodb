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
		text:'Second test todo',
		completed:true,
		completedAt:22
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

describe('DELETE /todos/:id',()=>{

	it('should remove a doc',(done)=> {
		var hexId= todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=> {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err,res)=> {
				if(err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo)=>{
					expect(todo).toBeNull();
					done();
				}).catch((e)=> done(e));
			});
	});

	it('should return a 404 if todo not found',(done) =>{
		var hexId=new ObjectID().toHexString();
		request(app)
			.get('/todos/'+hexId+'')
			.expect(404)
			.end(done);
	});

	it('should return a 404 if objectId is invalid',(done) => {
		request(app)
			.get('/todos/1111')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id',()=>{

	it('should update the todo',(done)=>{
		var hexId=todos[0]._id.toHexString();
		const text='This should be the new text';
		request(app)
			.patch(`/todos/${hexId}`,)
			.send({
				completed:true,
				text
			})
			.expect(200)
			.expect((res)=> {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBeTruthy();
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed',(done) => {
		var hexId=todos[1]._id.toHexString();
		var text='This is the new texty text';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed:false,
				text
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBeFalsy();
				expect(res.body.todo.completedAt).toBeNull();
			})
			.end(done);
	});
});