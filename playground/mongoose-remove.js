const {mongoose}= require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove({
// 	_id:'id'
// }).then((todo)=> {
// 	console.log(todo);
// });

Todo.findByIdAndRemove('5a38d615dfe7e534ede30ba5').then((todo)=> {
	console.log(todo);
});

