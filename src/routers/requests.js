const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const { sendEmail } = require("../utils/sendEmail");
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

    // to check if toUserId is valid
    const isToUserIdValid = await UserModel.findOne({ _id: toUserId });
    if (!isToUserIdValid) {
      throw new Error("User does not exist.");
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    // sending email to notify user

    const emailRes = await sendEmail(
      "Hello from AWS SES (classic) ✅",
      "This email is sent using SES classic with require().",
      isToUserIdValid.emailId
    );
    console.log(emailRes, isToUserIdValid);

    res.status(201).send({
      message:
        data.status === "interested"
          ? "Request sent successfully."
          : "Ignored successfully.",
      data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// accept or reject connection request
router.patch("/request/review/:status/:requestId", async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const status = req.params.status;
    const validStatus = ["accepted", "rejected"];

    // status validation
    if (!validStatus.includes(status)) {
      throw new Error("Invalid status type.");
    }

    // to check if it is a valid request
    const isRequestValid = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: userId,
      status: "interested",
    });
    if (!isRequestValid) {
      throw new Error("Request does not exist.");
    }

    // if request exist with status interested
    const data = await ConnectionRequestModel.findByIdAndUpdate(
      {
        _id: requestId,
      },
      { status }
    );
    res.status(200).send({
      message:
        status === "accepted"
          ? "Request accepted successfully."
          : "Request rejected successfully.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
