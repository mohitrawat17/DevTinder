const express = require("express");
const { validateUser } = require("../utils/validations");
const bcrypt = require("bcrypt"); // to encrypt passwords
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const router = express.Router();

const oneDay = 24 * 60 * 60 * 1000;
const cookieExpireTime = new Date(Date.now() + oneDay); // cookies in client side will expire in one day

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await UserModel.findOne({ emailId });

    if (user) {
      // decrypting password
      const isPasswordValid = await user.getDecryptedPassword(password);
      if (isPasswordValid) {
        // if email and password are validated then create a jwt token
        const token = user.getJWT(); //custom instance method for getting JWT
        res.cookie("token", token, { expires: cookieExpireTime }); // to set token in client side (in cookies)
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

module.exports = router
