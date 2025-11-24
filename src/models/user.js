const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    lastName:{
        type:String,    
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
    },
    age:{
        type:Number,
        min:18,
        max:70,
    },
    gender:{
        type:String,
        enum:{
            values : ["others","Male","Female",],
            message : `{VALUE} is not valid gender type`
        }
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
       default:"This is default about of user",
       validate(value){
        if(value.length > 125){
            throw new Error("Short the about")
        }
       }
    },
    skills: {
      type: [String],
      validate(value) {  
        if (value.length > 5) {
        throw new Error("Skills can't be more than 5");
        }
      },
      enum: {
          values: ["Nodejs", "React", "Java", "Python", "C++", "C", "Javascript", "Others"],
          message: "{VALUE} is not a valid skill"
      }
    }
},
{
  timestamps:true
})

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id:user._id},"DEV@Tinder$1505",{expiresIn:"7d"});
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashpassword = user.password;
    const isPasswordValid = await bycrypt.compare(passwordInputByUser , hashpassword);  
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);

module.exports = User;