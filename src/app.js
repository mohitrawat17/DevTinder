const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const connectionsRouter = require("./routers/requests");
const userRouter = require("./routers/user");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()); // this middleware parses data coming from server into JSON
app.use(cookieParser()); // this middleware parses cookies from the request.headers and makes them easily accessible via req.cookies
app.use("/", userAuth);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionsRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    // first db will connect then server will start so that we can use db in our server
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log("listening to PORT : ", PORT);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });
