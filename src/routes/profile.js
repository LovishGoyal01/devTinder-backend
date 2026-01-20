const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bycrypt = require("bcrypt");
const validator = require("validator");

const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age", "gender", "about", "skills"];

profileRouter.get("/view", userAuth, async (req,res)=>{
   try{
      const user = req.user;

      res.json({success:true, message:"Profile fetched successfully", user});
   }catch(error){
      res.json({success:false, message: error.message}); 
   }
});

profileRouter.patch("/edit", userAuth, async (req,res)=>{
 
   try{
       validateEditProfileData(req)

       const loggedInUser = req.user;

       USER_SAFE_DATA.forEach((key) => {
         if (req.body[key] !== undefined) {
            loggedInUser[key] = req.body[key];
         }
       });
       
       await loggedInUser.save({ runValidators: true });
   
       res.json({success:true ,message : `${loggedInUser.firstName} your profile was updated successfully`, user: loggedInUser});
     }catch(error){
       res.json({success:false, message: error.message});
     }
});  

profileRouter.patch("/editpassword", userAuth, async (req,res) =>{
 
   try{
      if(!validator.isStrongPassword(req.body.password)){
         throw new Error("Create a Strong Password");
      }
      const newPassword = req.body.password;

      const passwordHash = await bycrypt.hash(newPassword,10);

      const user = req.user;

      user.password = passwordHash;

      await user.save();
      res.json({success:true ,message: "Your password updated successfully"});

   }catch(error){
      res.json({success:false, message: error.message});
   }
});


module.exports = profileRouter;

