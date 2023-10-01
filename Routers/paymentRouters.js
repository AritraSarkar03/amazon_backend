import express from "express";
import { isAuthenticated } from "../Middlewares/Auth.js";
import { createSubscription, getRazorPayKey, paymentVerification } from "../controllers/paymentControllers.js";

const router = express.Router();

router.route("/payment").get(isAuthenticated, createSubscription);

router.route("/paymentverification").get(isAuthenticated, paymentVerification);

router.route("/razorpaykey").get(getRazorPayKey);

router.route("/payment/cancel").delete(isAuthenticated, createSubscription);

export default router;