var env=process.env.NODE_ENV || 'development';
// console.log('env========',env);
//setting up the db for diff env

if(env==='development') {
	process.env.PORT=3000;
	process.env.MONGODB_URI='mongodb://localhost:27017/ToDoAppProd';
} else 	{
	 process.env.PORT=3000;
	process.env.MONGODB_URI='mongodb://localhost:27017/ToDoAppProdTest';
}
