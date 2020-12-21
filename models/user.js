const mongoose=require("mongoose"); 

const SuggestionSchema=new mongoose.Schema({
  title:{type:String, required: true},
  category:{
    type:String, 
    required:true,
    enum:["Movie","TV Show","Music","Game"]
  }

});

const UserSchema=new mongoose.Schema({
  username:{type:String, required:true},
  password:{type:String,required:true},
  suggestionsList:[SuggestionSchema],
  watchingList:[SuggestionSchema]
}); 

const User=mongoose.model("User",UserSchema); 

module.exports=User;