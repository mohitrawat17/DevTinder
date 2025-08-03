const express = require("express");
const router = express.Router();

// api to send connection request

router.post("/sendConnectionRequest", async (req, res) => {
  const { user } = req;
  console.log(user);
});

module.exports = router;
