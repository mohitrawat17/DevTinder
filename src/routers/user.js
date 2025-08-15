const express = require("express");
const UserModel = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const router = express.Router();

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

// api to update user
router.patch("/profile/edit", async (req, res) => {
  const userId = req.user.id;

  try {
    if (req.body.password || req.body.emailId) {
      throw new Error("Invalid Request.");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      //equivalent to ({_id:userId}, {firstName:"Mohit", lastName:"Rawat"})
      runValidators: true, //allows validators to run which are in the schema
    });
    if (updatedUser) {
      res.status(200).send({ message: "User updated successfully !" });
    } else {
      res.status(400).send("User not found !");
    }
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

// api to change password

router.patch("/profile/change-password", async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // check if new password is strong
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password is too weak.");
  }

  try {
    const isPasswordValid = await req.user.getDecryptedPassword(
      currentPassword
    );

    // check if current password is correct
    if (isPasswordValid) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
        password: newPasswordHash,
      });
      if (updatedUser) {
        res.status(200).send({ message: "Password updated successfully." });
      }
    } else {
      throw new Error("Invalid current password.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
