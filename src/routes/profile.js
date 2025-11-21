const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bycrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
   try{
      const user = req.user;
      res.send(user);
    }
    catch(err)
     {
       res.status(400).send("Error : "+ err.message); 
     }

});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
 
   try{
       if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit request")
       }

       const loggedInUser = req.user;


       Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
       
       await loggedInUser.save();
   
       res.json({message : `${loggedInUser.firstName} your profile was updated successfully` , data : loggedInUser,});
     }
    catch(err)
     {
       res.status(400).send("Error : "+ err.message); 
     }
});  

profileRouter.patch("/profile/editpassword",userAuth, async (req,res) =>{
 
   try{
      if(!validator.isStrongPassword(req.body.password)){
         throw new Error("Create a Strong Password");
      }
      newPassword = req.body.password;

      const passwordHash = await bycrypt.hash(newPassword,10);

      const user = req.user;

      user.password = passwordHash;

      await user.save();
      res.send("Your password updated successfully");

    }catch(err){
      res.status(400).send("Error : "+ err.message); 
     }
});


module.exports = profileRouter;

