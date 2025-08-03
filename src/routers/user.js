const express=require('express');
const UserModel = require('../models/user');
const router=express.Router()


// api to get my profile
router.get("/profile", async (req, res) => {
  const user = req.user;
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  try {
    res.status(200).send(userWithoutPassword);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// api to get all the user in db
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// api to delete user by id
router.delete("/user/:id", async (req, res) => {
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

// api to update user by id
router.patch("/user/:id", async (req, res) => {
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



module.exports=router