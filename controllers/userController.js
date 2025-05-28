 const users = require("../model/userModel");

// jwt import
const jwt = require("jsonwebtoken");

// register
exports.registerController = async (req, res) => {
  //   logic

  const { username, email, password } = req.body;
  console.log(username, email, password);

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      res.status(409).json("Already user Exist");
    } else {
      const newuser = new users({
        username,
        email,
        password,
      });
      await newuser.save();
      res.status(200).json(newuser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// login
exports.loginController = async (req, res) => {
  // logic
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      if (existingUser.password == password) {
        const token = jwt.sign({ userMail: existingUser.email }, "secretkey");
        res.status(200).json({ existingUser, token });
      } else {
        res.status(401).json("invalid email or password");
      }
    } else {
      res.status(404).json("Account doest not exist.....");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// googlelogin
exports.googleLoginController = async (req, res) => {
  const { username, email, password, photo } = req.body;
  console.log(username, email, password, photo);

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ userMail: existingUser.email }, "secretkey");
      res.status(200).json({ existingUser, token });
    } 
    
    else {
      const newuser = new users({
        username,
        email,
        password,
        profile:photo
      });

      await newuser.save();
      
      const token = jwt.sign({ userMail: newuser.email }, "secretkey");
      res.status(200).json({ existingUser:newuser, token });
    }

  } catch (error) {
    res.status(500).json(error);
  }
};

// get all user
exports.getAllUsersController = async(req, res)=>{
  const email = req.payload
  console.log(email);
  
  try {

    const allUsers = await users.find({email:{$ne:email}})
    res.status(200).json(allUsers)
    
  } catch (error) {
    res.status(500).json(error)
  }
}

// edit  admin profile
exports.editAdminProfileController = async(req,res)=>{
 

 const {username, password,profile}= req.body
 const prof = req.file? req.file.filename : profile
 const email= req.payload
 console.log(email);
 
  try {
 const AdminDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof},{new:true})
 await AdminDetails.save()
 res.status(200).json(AdminDetails)
    
 
  } catch (error) {
    res.status(500).json(error)  }
}

// edit user profile
exports.editUserProfileController = async(req, res)=>{

  const {username,password,bio,profile}= req.body
  const prof = req.file? req.file.filename : profile
  const email = req.payload
  console.log(email);
  
  try {

    const userDetails = await users.findOneAndUpdate({email},{username,password,bio,profile:prof},{new:true})
    await userDetails.save()
    res.status(200).json(userDetails)

    
  } catch (error) {
     res.status(500).json(error)
  }
}

