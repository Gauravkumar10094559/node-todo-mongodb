const mongoose= require('mongoose');
const validator= require('validator');
const jwt= require('jsonwebtoken');
const _ =require('lodash');
const bcrypt = require('bcryptjs');

// what the user will look like
// {
// 	email:'asdfklj',
// 	password:'crazy long hash here',
// 	tokens:[
// 		{
// 			access:'auth',//email / resetting password 
// 			//all those are done using the tokens
// 			token:'adsfjlk;adfsjlk'//if user wants to add
			//something then he will use the token
// 		}
// 	]
// }

var UserSchema = new mongoose.Schema({
	email:{	// custom validation 
		type:String,
		required:true,
		minlength:1,
		trim:true,
		unique:true,//no other doc will have the same value of email
		validate:[{
					isAsync:false,
					validator:validator.isEmail,
					// validator:(value)=>{
					// 	return validator.isEmail(value); //either true or false
					// },
					message:'{VALUE} is not a valid email'
				}]
	},
	password:{
		type:String,
		required:true,
		minlength:6
	},
	tokens:[{
		access:{
			type:String,
			required:true
		},
		token:{
			type:String,
			required:true
		}
	}]
});


//to add instance methods and they have access to individual document

//to override method


UserSchema.methods.toJSON= function() {
	var user=this;
	var userObject=user.toObject();
	return _.pick(userObject,['_id','email']);
};

//general instance method
UserSchema.methods.generateAuthToken= function() {
	var user= this;
	var access= 'auth';
	var token= jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

	user.tokens.push({access,token});
	// console.log(user);
	return user.save().then(()=> {	
		return token;
	});
};

//model methods and statics object is like methods object the only
//diff is everything attached to it becomes model method

UserSchema.statics.findByToken= function(token) {
	var User = this;//NOT a single doc
	var decoded;
	try {
		decoded=jwt.verify(token,'abc123');
	} catch(e) {
		// return new Promise((resolve,reject) => {
		// 	reject();
		// });
		return Promise.reject();
	}
	return User.findOne({
		'_id':decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});
};


UserSchema.pre('save', function (next) {	//next must be passed and must be called
	var user =this;
	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt)=> {
			bcrypt.hash(user.password,salt,(err,hash)=>{
				console.log('before',user.password);
				user.password=hash;
				console.log('after',user.password);
				next();
			})
		})
	} else {
		next();
	}
});


var User=  mongoose.model('User',UserSchema);


module.exports={
	User
}; 