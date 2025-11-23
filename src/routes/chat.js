const express = require("express");
const chatRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const {Chat} = require("../models/chat");
const ConnectionRequest  = require("../models/connectionRequest");

chatRouter.get("/chat/:targetUserId",userAuth, async (req,res)=>{
  const {targetUserId} = req.params;
  const userId = req.user._id;

  try{

    const areFriends = await ConnectionRequest.findOne({
      $or:[{fromUserId:userId , toUserId:targetUserId ,status:"accepted"},
          {fromUserId:targetUserId , toUserId:userId ,status:"accepted"}
        ]
      });
      if(!areFriends){
        return res.status(403).json({ message: "You are not friends" });
      }

    let chat =await Chat.findOne({
        participants:{$all : [userId,targetUserId]},
    }).populate({
        path:"messages.senderId",
        select:"firstName lastName"
    });
    if(!chat){
       chat = new Chat({
           participants:[userId,targetUserId],
           messages: [],
       });
      await chat.save();
    }
    res.json(chat);
   }catch(err){
     res.send("ERROR : "+err.message);
   }
})

module.exports = chatRouter;

