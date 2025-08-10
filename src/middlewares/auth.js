const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth=  async (req, res, next) => {
  // Exclude login and signup paths
  if (req.path === "/login" || req.path === "/signup") {
    return next(); // Skip auth for these routes
  }

  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const jwtDecodedData = jwt.verify(token, process.env.JWT_SECRET_KEY); // decrypting data from jwt
    const userId = jwtDecodedData.id;
    const user = await UserModel.findOne({ _id: userId });
    console.log(user)
    if (!user) {
      throw new Error("No user found.");
    }

    req.user=user  //attatching user object in request

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports=userAuth