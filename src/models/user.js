const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validGenders = ["male", "female", "others"];
const expiryTime = "7d";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minLength: 5,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: validGenders,
      message: "{VALUE} is not valid gender",

      //validate will only when new object is created (for POST not PATCH)
      // validate(data) {
      //   if (!validGenders.includes(data)) {
      //     throw new Error("Invalid Gender.");
      //   }
      // },
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

// creating compound index for firstName and lastName
connectionRequestSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiryTime,
  }); //encrypting data to jwt
  return token;
};

userSchema.methods.getDecryptedPassword = async function (password) {
  const decryptedPassword = await bcrypt.compare(password, this.password);
  return decryptedPassword;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
