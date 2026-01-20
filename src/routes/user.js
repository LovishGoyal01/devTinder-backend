const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";

userRouter.get("/requests/received", userAuth, async (req,res)=>{
    try{
      const loggedInUser = req.user;
      
      const connectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested",
      }).populate("fromUserId" , USER_SAFE_DATA );

      res.json({success:true, message:"Connection Requests fetched successfully !!!",  connectionRequest:connectionRequest});
    }catch(error){
      res.json({success:false, message: error.message});
    }
});

userRouter.get("/connections", userAuth, async (req,res)=>{
    try{
      const loggedInUser = req.user;
      
      const connectionRequest = await ConnectionRequest.find({
       $or:[
          {toUserId :loggedInUser._id , status : "accepted"},
          {fromUserId:loggedInUser._id , status : "accepted"},
       ]
      })
       .populate("fromUserId" ,USER_SAFE_DATA)
       .populate("toUserId" ,USER_SAFE_DATA);

      const connections = connectionRequest.map((row)=> {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
      }) 

      res.json({success:true, message:"Connections fetched successfully !!!" , connections:connections});
    
    }catch(error){
      res.json({success:false, message: error.message});
    }
});

userRouter.get("/feed" , userAuth , async (req,res)=>{
  
    try{
     
      const loggedInUser = req.user;

      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50: limit;

      const skip = (page - 1)*limit;

      
      const connectionRequest = await ConnectionRequest.find({
       $or: [{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}]
      })

      const hideUserFromFeed = new Set();

      connectionRequest.forEach((req) =>{
        hideUserFromFeed.add(req.fromUserId._id.toString());
        hideUserFromFeed.add(req.toUserId._id.toString());
      })

      const users = await User.find({
       $and : [
        { _id : {$nin : Array.from(hideUserFromFeed)}},
        { _id : {$ne : loggedInUser._id.toString()}}
       ]
      }).select(USER_SAFE_DATA).skip(skip).limit(limit+1);

      
      const hasMore = users.length > limit;
      if (hasMore) users.pop(); // remove extra record

      return res.json({success: true, feed: users, hasMore });

    }catch(error){
      res.json({success:false, message: error.message});
    }

});

module.exports = userRouter;