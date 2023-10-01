import { Product } from "../Models/Product.js";
import { CatchAsyncError } from "../Middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../Utils/dataUri.js";
import cloudinary from "cloudinary";
import ApiFeatures from "../Utils/apiFeatures.js";

export const getAllProducts = CatchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);

  let products = await apiFeatures.query;
  if (!products) return next(new ErrorHandler("No Products found", 400));

  res.status(201).json({
    success: true,
    products,
    productCount,
  });
});

export const createProducts = CatchAsyncError(async (req, res, next) => {
  const { name, desc, price, category, stock } = req.body;
  const file = req.file;

  if (!name || !desc || !price || !category || !stock)
    return next(new ErrorHandler("Please add all fields", 400));

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.uploader.upload(fileUri.content); // , { resource_type: 'video'}

  await Product.create({
    name,
    desc,
    category,
    price,
    stock,
    images: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Product added successfully",
  });
});

export const updateProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findById(req.params.id);
  if (!products) return next(new ErrorHandler("Product not found", 400));

  // products = await Product.findByIdAndUpdate(req.params.id,req.body,{
  //     new: true,
  //     runValidators: true,
  //     useFindAndModify: false,
  // });

  const { name, desc, price, category, stock } = req.body;

  if (name) products.name = name;
  if (desc) products.desc = desc;
  if (price) products.price = price;
  if (category) products.category = category;
  if (stock) products.stock = stock;

  await products.save();

  res.status(201).json({
    success: true,
    products,
  });
});

export const deleteProduct = CatchAsyncError(async(req,res,next)=>{
  const { id } = req.params;
  const product = await Product.findById(req.params.id);

  if(!product) return next(new ErrorHandler("Product not found",400));

  await cloudinary.uploader.destroy(product.images.public_id);

  await product.deleteOne();

  res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getProductDetails = CatchAsyncError(async(req,res,next)=> {
  const { id } = req.params;
  const product = await Product.findById(req.params.id);

  if(!product) return next(new ErrorHandler("Product not found",400));

  res.status(201).json({
    success: true,
    product,
  });
});

export const updateReview = CatchAsyncError(async(req,res,next) => {
  const {id} = req.params;
  const product = await Product.findById(req.params.id);

  const {rating,comment} = req.body;

  if(!rating) return next(new ErrorHandler("Please atleast enter the ratings", 409));

  // review: {
  //   ratings: rating,
  //   comment: comment
  // }

  res.status(201).json({
    success: "true",
    message: "Review updated successfully"
  })
});

