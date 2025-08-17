const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const router = express.Router();

// api to send connection request

router.post("/request/:status/:toUserId", async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const validStatus = ["interested", "ignored"];

    // status validation
    if (!validStatus.includes(status)) {
      throw new Error("Invalid status type.");
    }

    //  duplicate entries prevention
    const isExisted = await ConnectionRequestModel.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });
    if (isExisted) {
      throw new Error("Connection request already exist.");
    }

    // to check if fromUserId is valid
    const isToUserIdValid = await UserModel.findOne({ _id: toUserId });
    if (!isToUserIdValid) {
      throw new Error("User is not exist.");
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.status(201).send({ message: data.status==='interested'?"Request sent successfully.":"Ignored successfully.", data });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
