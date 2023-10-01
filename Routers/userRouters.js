import express from "express";
import { changePassword, deleteMyProfile, forgetPassword, getMyProfile, login, logout, register, resetPassword, updateProfile } from "../Controllers/userControllers.js";
import { isAuthenticated } from "../Middlewares/Auth.js";

const router = express.Router();
 
router.route("/register").post(register);

router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/me").delete(isAuthenticated, deleteMyProfile);

router.route("/changepassword").put(isAuthenticated,changePassword);

router.route("/updateprofile").put(isAuthenticated, updateProfile);

router.route("/resetpassword/:token").put(isAuthenticated, resetPassword);

router.route("/forgetpassword").post(isAuthenticated, forgetPassword);

export default router;  