import {User} from "../Models/User.js";
import { CatchAsyncError } from "../Middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {sendToken} from "../Utils/sendToken.js";
import { sendEmail } from "../Utils/sendEmail.js";
import crypto from "crypto";

export const register = CatchAsyncError(async(req,res,next)=> {
   const {name,email,password} = req.body;

   if(!name || !email || !password) return next(new ErrorHandler("Please add all fields", 400));

   let user = await User.findOne({ email });
   if(user) return next(new ErrorHandler("User already exists", 409));

   
   user = await User.create({
     name,
     email,
     password
    });

   sendToken(res,user,"Registered successfully",201);
});

export const login = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please add all fields", 400));

  let user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new ErrorHandler("Incorrect Password or Email Id", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Password or Email Id", 400));

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});


export const logout = CatchAsyncError(async (req, res, next) => {
   res
     .status(200)
     .cookie("token", null, {
       expires: new Date(Date.now()),
     })
     .json({
       success: true,
       message: "Log out successfully",
     });
 });

export const getMyProfile = CatchAsyncError(async (req, res, next) => {
 
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

 export const changePassword = CatchAsyncError(async(req,res,next) => {
   const {oldPassword,newPassword} = req.body;
   if(!oldPassword || !newPassword) return next(new ErrorHandler("Please add all fields", 400));

   let user = await User.findById(req.user._id).select("+password");
   
   const isMatch = user.comparePassword(oldPassword);
   if(!isMatch) return next(new ErrorHandler("Incorrect Password",409));

   user.password = newPassword;

   user.save();

   res
     .status(200)
     .json({
       success: true,
       message: "Password changes succesfully",
     });
 });

 export const updateProfile = CatchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

 export const deleteMyProfile = CatchAsyncError(async (req, res, next) => {
   const user = await User.findById(req.user._id);
 
   if (!user) return next(new ErrorHandler("User not found", 404));
 
   await user.deleteOne();
 
   res
     .status(200)
     .cookie("token", null, {
       expires: new Date(Date.now()),
     })
     .json({
       success: true,
       message: "User deleted successfully",
     });
 });

 export const forgetPassword = CatchAsyncError(async (req, res, next) => {
  const {email} = req.body;

  if (!email)
    return next(new ErrorHandler("Please add Email", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link below. ${url}`;

  await sendEmail(user.email, "LearnTube Reset Password", message);
  
  res.status(200).json({
    success: true,
    message: `Reset token has been sent to ${user.email}`,
  });
});

export const resetPassword = CatchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");


  const user = await User.findOne({ resetPasswordToken, 
    resetPasswordExpire: {
    $gt: Date.now(),
  },
});

  if(!user) return next(new ErrorHandler("Token expired", 409));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});
 