const express = require("express");
const authRouter = express.Router();

const {validSignUpdata} = require("../utils/validation");
const User = require("../models/user");
const bycrypt = require("bcrypt");

const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age", "gender", "about", "skills"];

authRouter.post("/signup" , async (req,res) => {
 
    try{
      validSignUpdata(req);
      const {firstName,lastName,emailId,password} = req.body;

      const isEmailAlreadyUsed = await User.findOne({emailId: emailId});
      if(isEmailAlreadyUsed){
         throw new Error("User already exists")
      }

      const passwordHash = await bycrypt.hash(password,10);

      const user=new User({
         firstName,
         lastName,
         emailId,
         password:passwordHash,
      });

     const savedUser = await user.save();

     const userSafeData = Object.fromEntries( 
        Object.entries(savedUser.toObject()).filter(([key]) => USER_SAFE_DATA.includes(key))
     );
     
     const token = await savedUser.getJWT();
      res.cookie("token",token,{
         path: "/", 
         httpOnly: true,
          secure: true,
          sameSite: "none",
         expires:new Date(Date.now() + 8*3600000)
      });

      res.json({success:true, message:"User Added Successfully!!", user:userSafeData});
    
    }catch(error){
       res.status(400).json({success:false, message: error.message});
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

       const userSafeData = Object.fromEntries(
         Object.entries(user.toObject()).filter(([key]) => USER_SAFE_DATA.includes(key))
       )
  
      const token = await user.getJWT();
      res.cookie("token",token,{
         path: "/", 
         httpOnly: true,
          secure: true,
          sameSite: "none",
         expires:new Date(Date.now() + 8*3600000)
      });

      res.json({success:true, message:"User logged in Successfully!!", user:userSafeData});

    }catch(error){
      res.status(400).json({success:false, message: error.message});
    }
});

authRouter.post("/logout" , async (req,res) => {
   try{
     res.cookie("token" , null , { 
       expires : new Date(Date.now()),
     });
     res.json({success:true, message:"Logout Successfull !!!"});
   }catch(error){
     res.status(400).json({success:false, message: error.message});
   }
    
});

module.exports = authRouter;


