var mongoose   = require("mongoose");

var commentSchema = new mongoose.Schema({
	text : String,
	author: {
		//id is reference to the user model id 
		id:{
			type:mongoose.Schema.Types.ObjectId,
			//ref refers to the model with which id is associated
			ref:"User"
		},
		username:String
	}
}); 

module.exports = mongoose.model("Comment",commentSchema);