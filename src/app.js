const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt"); // to encrypt passwords
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/user");
const { validateUser } = require("./utils/validations");
const userAuth = require("./middlewares/auth");
require('dotenv').config()

const app = express();
const PORT = 5000;

app.use(express.json()); // this middleware parses data coming from server into JSON
app.use(cookieParser()); // this middleware parses cookies from the request.headers and makes them easily accessible via req.cookies
app.use("/", userAuth);

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  try {
    // validating user
    validateUser(userObj);

    // encrypting password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    // creating a new instace of the UserModel model
    const user = new UserModel({ ...userObj, password: encryptedPassword });
    const result = await user.save();

    // Convert to plain JS object
    const userWithoutPassword = result.toObject();
    delete userWithoutPassword.password;

    res.status(200).send(userWithoutPassword);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// user login

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await UserModel.findOne({ emailId });

    if (user) {
      // decrypting password
      const decryptedPassword = await bcrypt.compare(password, user.password);
      if (decryptedPassword) {
        // if email and password are validated then create a jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY); //encrypting data to jwt
        res.cookie("token", token); // to set token in client side (in cookies)
        res.status(200).send({ message: "Logged in successfully !" });
      } else {
        throw new Error("Invalid credentials.");
      }
    } else {
      // throw new Error('Invalid Email Id !')   // this is not a ideal way bcz of this we are exposing our db and telling the user that, Is that email is present or not in our DB ?
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// api to get my profile
app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  const jwtDecodedData = jwt.verify(token, process.env.JWT_SECRET_KEY); // decrypting data from jwt
  const userId = jwtDecodedData.id;
  const user = await UserModel.findOne({ _id: userId });
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  try {
    res.status(200).send(userWithoutPassword);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// to get all the user in db
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// to delete user by id
app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId); //equivalent to ({_id:userId})
    if (deletedUser) {
      res.status(200).send({ message: "User Deleted Successfully !" });
    } else {
      res.status(400).send("User not found !");
    }
  } catch (error) {
    res.status(400).send("Internal server error");
  }
});

// to update user by id
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      //equivalent to ({_id:userId}, {firstName:"Mohit", lastName:"Rawat"})
      runValidators: true, //allows validators to run which are in the schema
    });
    if (updatedUser) {
      res.status(200).send({ message: "User Updated Successfully !" });
    } else {
      res.status(400).send("User not found !");
    }
  } catch (error) {
    res.status(400).send(error.message);
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
