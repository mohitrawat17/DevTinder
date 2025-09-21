const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const router = express.Router();

router.get("/user/requests/recieved", async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName","age","gender","photo","skills"]);
    const responseToSend=connectionRequests.map(item=>item.fromUserId)
    res
      .status(200)
      .send({ message: "Data fetched successfully", data: responseToSend });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
