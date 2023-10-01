import { Order } from "../Models/Order.js";
import { Product } from "../Models/Product.js";
import { CatchAsyncError } from "../Middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const newOrder = CatchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

export const getSingleOrder = CatchAsyncError(async(req,res,next)=> {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if(!order) return next(new ErrorHandler("Order not found", 404));

  res.status(201).json({
    success: true,
    order,
  })
});

export const getMyOrder = CatchAsyncError(async(req,res,next)=> {
  const orders = await Order.findById(req.user._id);

  res.status(201).json({
    success: true,
    orders,
  })
});

export const getAllOrder = CatchAsyncError(async(req,res,next)=> {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach(order=>{
    totalAmount += order.totalPrice;
  });

  res.status(201).json({
    success: true,
    orders,
  });
});

export const updateOrder = CatchAsyncError(async(req,res,next)=> {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if(order.orderStatus === "Delivered") return next(new ErrorHandler("This Order have been delivered", 404));

  order.orderItems.forEach(async(o) => { 
     updateStock(o.Product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if(req.body.status==="Delivered") order.deliveredAt = Date.now();

  await order.save({ validateBeforeSave: false })

  res.status(201).json({
    success: true,
    order,
  })
});

async function updateStock(id,quantity){
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

export const deleteOrder = CatchAsyncError(async(req, res, next) => {
  const order = await Order.findById(req.params.id);

  if(!order) return next(new ErrorHandler("Order not found", 404));

  await order.deleteOne();

  res.status(201).json({
    success: true,
  });
});