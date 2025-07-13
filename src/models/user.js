const { default: mongoose } = require("mongoose")

const userSchema=mongoose.Schema({
     firstName:{
        type:String
     },
     lastName:{
        type:String
     },
     emailId:{
        type:String,
     },
     password:{
        type:String
     },
     age:{
        type:Number
     },
     gender:{
        type:String 
     }
},
{
  timestamps: true
}
)

const UserModel=mongoose.model("User",userSchema)
module.exports=UserModel