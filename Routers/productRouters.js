import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  updateReview,
} from "../Controllers/productControllers.js";
import singleUpload from "../Middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../Middlewares/Auth.js";

const router = express.Router();

router.route("/allproducts").get(getAllProducts);
router.route("/product/details/:id").get(getProductDetails);
router.route("/product").post(isAuthenticated, authorizeAdmin, singleUpload,createProducts);
router
  .route("/product/:id")
  .put(updateReview)
  .delete(isAuthenticated, authorizeAdmin, deleteProduct);
router.route("/product/update/:id").put(isAuthenticated, authorizeAdmin, updateProduct);

export default router;
