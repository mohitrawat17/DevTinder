const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const router = express.Router();
const userDataKeys = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photo",
  "skills",
];

router.get("/user/requests/recieved", async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", userDataKeys);
    const responseToSend = connectionRequests.map((item) => item.fromUserId);
    res
      .status(200)
      .send({ message: "Data fetched successfully", data: responseToSend });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/user/connections", async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: userId }, { fromUserId: userId }],
      status: "accepted",
    })
      .populate("fromUserId", userDataKeys)
      .populate("toUserId", userDataKeys);
    const responseToSend = connectionRequests.map((item) => {
      if(item.fromUserId.id===userId){
         return item.toUserId
      }
      return item.fromUserId
    });
    res
      .status(200)
      .send({ message: "Data fetched successfully", data: responseToSend });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
