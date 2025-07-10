const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();
const PORT = 5000;

app.post("/signup", async (req, res) => {
  //  const {firstName,lastName,emailId,password,age,gender}=req.body

  const userObj = {
    firstName: "Dummy Name",
    lastName: "Dummy Name",
    emailId: "dummyemail@gmail.com",
    password: "dummyPassword",
    age: 30,
    gender: "Male",
  };

  // creating a new instace of the UserModel model 
  const user = new UserModel(userObj);
  try {
    await user.save();
    console.log("in");
    res.status(200).send({
      ...userObj,
      message: "Successfully SignedUp",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send('Something went wrong !')
  }
});

connectDB()
  .then(() => {
    // first db will connect then server will start so that we can use db in our server
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log("listening to PORT : ", PORT);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });
