const jwt = require("jsonwebtoken");
const User = require("../models/user")

const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age", "gender", "about", "skills"];

const userAuth = async (req,res,next) =>{
 try{

    const {token} = req.cookies;
    if(!token){
      return res.json({success: false, message: "Please Login"});
    }

    const decodedObj = jwt.verify(token,process.env.JWT_SECRET);
    const {_id} = decodedObj;

    const user = await User.findById(_id).select(USER_SAFE_DATA);
    if(!user){
      throw new Error("User not found!!!");
    }

    req.user = user;
    next();

  }catch(error){
    res.json({success:false, message: error.message});
  }
}

module.exports = {
    userAuth,
}
