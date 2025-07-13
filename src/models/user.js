const { default: mongoose } = require("mongoose");

const validGenders=['male','female','others'] 

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minLength:5,
      maxLength:30
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min:18,
    },
    gender: {
      type: String,
      //validate will only when new object is created (for POST not PATCH)
      validate(data){
         if(!validGenders.includes(data)){
            throw new Error('Invalid Gender.')
         }
      }
    },
    photo: {
      type: "String",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
