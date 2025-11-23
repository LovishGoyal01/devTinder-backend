const express = require("express");
const authRouter = express.Router();

const {validSignUpdata} = require("../utils/validation");
const User = require("../models/user");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";

authRouter.post("/signup" , async (req,res) => {
 
    try{
      validSignUpdata(req);
      const {firstName,lastName,emailId,password,age,gender} = req.body;

      const passwordHash = await bycrypt.hash(password,10);

      const user=new User({
         firstName,
         lastName,
         emailId,
         password:passwordHash,
         age,
         gender,
      });

     const savedUser = await user.save();
     
     const token = await savedUser.getJWT();
      res.cookie("token",token,{
         path: "/", 
         httpOnly: true,
          secure: true,
          sameSite: "none",
         expires:new Date(Date.now() + 8*3600000)
      });

      res.json({message:"User Added Successfully!!" ,data:savedUser});
    
    }catch(err){
       res.status(400).send("Error : "+ err.message);
     }
});

authRouter.post("/login" , async (req,res) => {
 
    try{
      const {emailId,password} = req.body;
    
      const user = await User.findOne({emailId:emailId});
      if(!user){
         throw new Error("Invalid Credentials");
        } 

      const isPasswordValid = await user.validatePassword(password);
       if(!isPasswordValid){
          throw new Error("Invalid Credentials");
       }
  
      const token = await user.getJWT();
      res.cookie("token",token,{
         path: "/", 
         httpOnly: true,
          secure: true,
          sameSite: "none",
         expires:new Date(Date.now() + 8*3600000)
      });

      res.send(user);

    }catch(err){
       res.status(400).send("Error : "+ err.message);
     }
});

authRouter.post("/logout" , async (req,res) => {
    res.cookie("token" , null , { 
       expires : new Date(Date.now()),
    });
    res.send("User logged Out");
});

module.exports = authRouter;


