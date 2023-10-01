import mongoose from "mongoose";

const schema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
      default: "India",
    },
    pincode: {
      type: Number,
      require: true,
    },
    phoneNo: {
      type: Number,
      require: true,
    },
  },
  orderItems: {
    name: {
      type: String,
      require: true,
    },
    quantity: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  user: {
    type: String,
    ref: 'User',
    require: true,
  },
  paymentInfo:{
    id:{
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
  },
  paidAt:{
    type: Date,
    require: true,
  },
  itemsPrice: {
    type: Number,
    require: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    require: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    require: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    require: true,
    default: 0,
  },
  orderStatus: {
    type: Number,
    require: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

export const Order = new mongoose.model("Order", schema);
