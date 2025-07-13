const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();
const PORT = 5000;

app.use(express.json()); // this middleware parse JSON data coming from server

app.post("/signup", async (req, res) => {
  const userObj = req.body;
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
    console.log(error);
    res.status(500).send("Something went wrong !");
  }
});

// to get all the user in db
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Internal server error");
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
    console.log("catch");
    res.status(400).send("Internal server error");
  }
});

// to update user by id
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body); //equivalent to ({_id:userId}, {firstName:"Mohit", lastName:"Rawat"})
    if (updatedUser) {
      res.status(200).send({ message: "User Updated Successfully !" });
    } else {
      res.status(400).send("User not found !");
    }
  } catch (error) {
    console.log("catch");
    res.status(400).send("Internal server error");
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
