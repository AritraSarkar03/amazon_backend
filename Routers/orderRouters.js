import express from "express";
import { deleteOrder, getAllOrder, getMyOrder, getSingleOrder, newOrder, updateOrder } from "../Controllers/orderControllers.js";
import { isAuthenticated, authorizeAdmin } from "../Middlewares/Auth.js"

const router = express.Router();

router.route("/order/new").post(isAuthenticated, newOrder);

router.route("/order/:id").get(isAuthenticated, authorizeAdmin, getSingleOrder);

router.route("/order/me").get(isAuthenticated, getMyOrder);

router.route("/admin/orders").get(isAuthenticated, authorizeAdmin, getAllOrder);

router.route("/admin/order/:id").put(isAuthenticated,authorizeAdmin,updateOrder).delete(isAuthenticated,authorizeAdmin,deleteOrder);

export default router;