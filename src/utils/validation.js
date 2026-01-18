const validator = require("validator");

const validSignUpdata= (req) =>{

  const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName || !emailId || !password){
         throw new Error("Something Is Missing");
      }
    if(!validator.isEmail(emailId)){
      throw new Error("Not valid email");
      }
    if(!validator.isStrongPassword(password)){
        throw new Error("Not strong password");
     }       
}
const validateEditProfileData = (req) => {

  const requiredFields = ["firstName", "lastName", "age", "gender", "photoURL", "about", "skills"];

  // 1️⃣ All fields must be present
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`${field} is required`);
    }
  }

  const allowedEdits = [...requiredFields];

  const isEditAllowed = Object.keys(req.body)
    .every(field => allowedEdits.includes(field));

  if (!isEditAllowed) {
    throw new Error("Invalid fields in edit request");
  }

  const { firstName, lastName, age, gender, photoURL, about, skills } = req.body;

  // 2️⃣ Null / empty validation
  for (const [key, value] of Object.entries(req.body)) {
    if (value === null || value === undefined) {
      throw new Error(`${key} cannot be null or undefined`);
    }

    if (typeof value === "string" && value.trim() === "") {
      throw new Error(`${key} cannot be empty`);
    }
  }

  // 3️⃣ Field validations
  if (firstName.trim().length < 3) {
    throw new Error("First name must be at least 3 characters");
  }

  if (lastName.trim().length < 3) {
    throw new Error("Last name must be at least 3 characters");
  }

  const ageNumber = Number(age);

  if (!Number.isInteger(ageNumber)) {
    throw new Error("Age must be a valid number");
  }

  if (ageNumber < 18 || ageNumber > 100) {
    throw new Error("Age must be between 18 and 100");
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    throw new Error("Invalid gender value");
  }

  if (!photoURL.startsWith("http")) {
    throw new Error("Invalid photo URL");
  }

  if (about.length > 150) {
    throw new Error("About section must be under 150 characters");
  }
    if (about.length < 100) {
    throw new Error("About section must be more than 100 characters");
  }

  if (!Array.isArray(skills)) {
    throw new Error("Skills must be an array");
  }

  if (skills.length === 0) {
    throw new Error("Skills cannot be empty");
  }

  return true;
};

module.exports = {
  validSignUpdata,
  validateEditProfileData,
};