const {SHA256}= require('crypto-js');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password= '123abc!';

bcrypt.genSalt(10,(err,salt) => {
	bcrypt.hash(password,salt,(err,hash)=>{
		console.log(hash);
	});
});

var hashedpass='$2a$10$sO5NHgKxzvqp1H2FdDWiIur9yVPFSqdgnFcWLdvCcWgWbHAvlI5ii';

bcrypt.compare(password,hashedpass,(err,res) => {
	console.log(res);
});

// var data={
// 	id:10
// };

// // jwt.sign//to sign in the data and generate hast values
// // jwt.verify//to verify hashes

// //head over to jwt.io to check the authencity and parts of the token
// var token= jwt.sign(data,'thisisthesecrethere');//token is what will be sent to the user for sign in and log in and stored in the db
// console.log(token);

// var decoded=jwt.verify(token,'thisisthesecrethere');//if token or the secret is tempered with then the signature will be invalid
// console.log('decoded',decoded);



// var message='Top of the morning to ya ladies!';
// var hash= SHA256(message).toString();

// console.log(`message: ${message}`);//now everytime a user
// //passes a value it will give the same value back
// //it's a one way encryption , when user passes the password
// //we match it with the hash and we don't store the password
// //instead.
// console.log(`hash: ${hash}`);

// //JSON WEB TOKENS (this is jwt)


// //if jsonwebtoken lib is used then down below is the part
// //for sign
// var data={
// 	id:4
// };

// var token={
// 	data,
// 	hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// };


// //somesecret is what is on the server only and no one else can access it so when a user does 

// //and from here is verify
// token.data.id=5;
// token.hash=SHA256(JSON.stringify(data)).toString();//it will fail bcuz stupid user doesn't know that we used salting

// var resultHash=SHA256(JSON.stringify(data)+'somesecret').toString();
// if(resultHash===token.hash) {
// 	console.log('OOOKAY');
// } else {
// 	console.log('NOT OOKAY');
// }

