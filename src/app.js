require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials : true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
 .then(()=>{
    console.log("Connected to DB successfully");
    const PORT = process.env.PORT || 1505;
    server.listen(PORT, "0.0.0.0",()=>{
    console.log("Server created successfully");
    })
 })
 .catch(()=>{
     console.log("Server not started");
 });
