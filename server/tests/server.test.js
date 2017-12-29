const request= require('supertest');
const {ObjectID} = require('mongodb');
const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {todos,populateTodos,users,populateUsers}=require('./seed/seed');

// var todos=[
// 	{
// 		_id:new ObjectID(),
// 		text:'First test todo'
// 	},
// 	{
// 		_id:new ObjectID(),
// 		text:'Second test todo',
// 		completed:true,
// 		completedAt:22
// 	}
// ];

beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach((done)=>{	//to have the same db every time we test
// 	// Todo.remove({}).then(()=>done());//for just post routes
// 	Todo.remove({})
// 					.then(()=>{	//first remove all
// 						return Todo.insertMany(todos);	//then add dummy data
// 					})
// 					.then(()=> done());	//and then finish with done()
// });

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


describe('GET /users/me',()=> {
		
	it('should return user if authenticated',(done)=>{
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res)=> {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated and an empty body',(done) => {

		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);

	});

});

describe('POST /users',()=>{
	it('should create a user',(done)=>{
		var email='abc@g.com';
		var password='password';
		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toBeDefined();
				expect(res.body._id).toBeDefined();
				expect(res.body.email).toBeDefined();
			})
			.end((err)=> {
				if(err) {
					return done(err);
				}
				User.findOne({email}).then((user)=>{
					expect(user).toBeDefined();
					expect(user.password).not.toBe(password);
					done();
				});
			});
	});

	it('should return validation errors if request is invalid',(done)=> {
		var email='fail@g.com';
		var password='fail';
		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);
	});

	it('shouldnot create a user if an email is invalid',(done)=> {
		var email=users[0].email;
		var password='passwordone';
		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done);
	});

});

describe('POST /users/login',()=> {
	it('should login user and return auth token',(done) => {

		request(app)
			.post('/users/login')
			.send({
				email:users[1].email,
				password:users[1].password
			})
			.expect(200)
			.expect((res)=> {

				expect(res.headers['x-auth']).toBeDefined();
			})
			.end((err,res)=> {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					// expect(user.tokens[0]).toInclude({
					// 	access:'auth',
					// 	token:res.headers['x-auth']
					// });
					expect(user.tokens[0].access).toBe('auth');
					expect(user.tokens[0].token).toBe(res.headers['x-auth']);
					done();
				}).catch((e)=> done(e));
			});
	});

	it('should reject invalid login',(done) => {

		request(app)
			.post('/users/login')
			.send({
				email:users[1].email,
				password:users[1].password+'incorrect'
			})
			.expect(400)
			.expect((res)=> {

				expect(res.headers['x-auth']).not.toBeDefined();
			})
			.end((err,res)=> {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					// expect(user.tokens[0]).toInclude({
					// 	access:'auth',
					// 	token:res.headers['x-auth']
					// });
					expect(user.tokens.length).toBe(0);
					
					done();
				}).catch((e)=> done(e));
			});
	});

});

describe('DELETE /users/me/token',()=> {
	it('should remove auth token on logout',(done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.end((err,res)=> {
				if(err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					
					done();
				}).catch((e)=> done(e));
			});
	});
})