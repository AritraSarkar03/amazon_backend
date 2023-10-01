import express from "express";
import { contact, getDashboardStat } from "../Controllers/otherControllers.js";
import { isAuthenticated, authorizeAdmin } from "../Middlewares/Auth.js"

const router = express.Router();

router.route("/contact").post(contact);

//router.route("/admin/stats").post(isAuthenticated, authorizeAdmin, getDashboardStat);

export default router;