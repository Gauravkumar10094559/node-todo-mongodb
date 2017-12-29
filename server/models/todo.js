const mongoose=require('mongoose');
var Todo= mongoose.model('Todo',{	//'Todo' will be automatically lowercased and pluralized
	text:{
		type:String,
		required:true,//built-in validator
		minlength:1,//other validator
		trim:true//validator that remove leading and trailing whitespace
	},
	completed:{
		type:Boolean,
		default:false//validator
	},
	completedAt:{
		type:Number,
		default:null
	},
	_creator:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	}
});

module.exports={
	Todo
}