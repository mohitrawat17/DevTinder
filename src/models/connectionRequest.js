const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"], //only these strings are accepted
      message: "{VALUE} is not a valid status.",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// creating compound index for toUserId and fromUserId
connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

// to check if toUserId and fromUserId are not same
connectionRequestSchema.pre("save", function (next) {
  //pre is a middleware which runs before saving an entry in the db
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Self connection request is not allowed.");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
