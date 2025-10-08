const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const router = express.Router();
const userDataKeys = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photo",
  "skills",
];

// to see connection requests list
router.get("/user/requests/recieved", async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", userDataKeys);
    const responseToSend = connectionRequests.map((item) => item);
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: responseToSend });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// users connections list
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
      if (item.fromUserId.id === userId) {
        return item.toUserId;
      }
      return item.fromUserId;
    });
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: responseToSend });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/feed", async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    pageSize = pageSize > 50 ? 50 : pageSize;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: userId }, { fromUserId: userId }],
    }).select("fromUserId toUserId");

    const usersToHide = new Set();
    connectionRequests.forEach((req) => {
      usersToHide.add(req.fromUserId.toString());
      usersToHide.add(req.toUserId.toString());
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(usersToHide) } },
        { _id: { $ne: userId } },
      ],
    })
      .select(userDataKeys)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// logout api
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
