import { User } from '../models/user.model.js';

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (req, res)=>{

  try{
    const {fullName, phoneNumber, email, password, role} = req.body;

    if(!fullName || !phoneNumber || !email || !password || !role){
      return res.status(404).json({
        message:"something is missing",
        success:false,
      });
    }

    const user = await User.findOne({email});

    if(user){
      return res.status(400).json({
        message:" User already exists with this email",
        success:false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      phoneNumber,
      email,
      password:hashedPassword,
      role
    });

    return res.status(201).json({
      message:"Account created successfully!",
      success:true
    })
  }
  catch(error){
    return error
  }
}

export const login = async(req, res) =>{

try{
  const {email, password, role} = req.body;

  if(!email || !password || !role){
    return res.status(400).json({
      message:"something is missing",
      success:false,
    });
  }

  let user = await User.findOne({email});
  if(!user){
    return res.status(400).json({
      message:"Incorrect email or password",
      success:false
    })
  }

  const isPasswordMatch = bcrypt.compare(password, user.password);
  if(!isPasswordMatch){
    return res.status(400).json({
      message: " Incorrect password",
      success:false
    });
  }
  if(role !== user.role){
    return res.status(400).json({
      message: " Account does not exist with current role",
      success:false
    });
  }

  const tokenData = {
    userId:user._id
  }
  const token = jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'} );

  user={
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    password:user.password,
    phoneNumber:user.phoneNumber,
    role:user.role,
    profile:user.profile
  }

  return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
    message:`Welcome back ${user.fullName}`,
    success:true
  });

}catch(error){
return error;
}
}

export const logout = async (req, res) =>{
  try{
    return res.status(200).cookie("token", " ", {maxAge:0}).json({
      message:" logged Out Successfully",
      success:true
    })
  }catch(error){
    console.log(error)
  }
}

export const updateProfile = async (req, res)=>{

  try{
    const {fullName, phoneNumber, email, bio, skills} = req.body;
    const file = req.file; //for resume
    
    //as we are receiving skills in string form from req.body, now we have to convert it in array
    let skillsArray

    if(skills){
      skillsArray = skills.split(",");
    }

    const userId = req.id;//from authentication middleware
    console.log(userId);
    let user = await User.findById(userId);
    console.log(user);
    if(!user){
      return res.status(400).json({
        message:"User not found",
        success:false
      })
    }

    // user data is updating here
    if(fullName) user.fullName = fullName
    if(email) user.email = email
    if(phoneNumber) user.phoneNumber = phoneNumber
    if(bio) user.profile.bio = bio
    if(skills) user.profile.skills = skillsArray

    await user.save();
    
    //  user with updated data
  user={
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    password: user.password,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile
  }
  return res.status(200).json({
    message:" Profile Updated Successfully!",
    user,
    success:true
  });

  }
catch(error){
  console.log(error);
}
}