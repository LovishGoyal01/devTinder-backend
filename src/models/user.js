const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3, 
        maxLength:50,
        trim:true,
    },
    lastName:{
        type:String, 
        trim:true,   
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){     
           if(!validator.isEmail(value)){
            throw new Error("Not valid email");
           }
        },
    },
    password:{
        type:String,
        required:true,
        minLength: 6, 
        trim:true, 
    },
    age:{
        type:Number,
        min:18,  
        max:100,
    },
    gender:{
        type:String,
        enum:{
            values : ["Other","Male","Female"],
            message : `{VALUE} is not valid gender type`
        },
    },
    photoURL:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
        validate(value){
           if(!validator.isURL(value)){
            throw new Error("Not valid photoURL");
           }
        }   
    },
    about:{
       type:String,
       trim:true,
       minlength: 100,
       maxlength: 150,
       default: "This is your default about section. Share a bit about yourself so people can connect with you and understand your interests, background, and personality."
    },
    skills: {
      type: [String],
      default : ["Default"],
      validate(value) {  
        if (value.length > 10) {
          throw new Error("Skills can't be more than 10");
        }
      
        const cleaned = value.map((s) => s.trim()).filter(Boolean);
        const unique = new Set(cleaned);

        if (cleaned.length !== unique.size) {
          throw new Error("Duplicate skills are not allowed");
        }
     },
   },
},
{
  timestamps:true
})

userSchema.methods.getJWT = function () {

    const user = this;
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashpassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser , hashpassword);  
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);

module.exports = User;