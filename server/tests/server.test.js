const request= require('supertest');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

var todos=[
	{
		text:'First test todo'
	},
	{
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
			expect(res.body.text).toBe(text);
		})
		.end((err,res)=>{
			if(err) {
				return done(err);
			}
			Todo.find({text}).then((todos)=>{
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