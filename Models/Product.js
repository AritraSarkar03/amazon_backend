import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter product name"],
  },
  desc: {
    type: String,
    require: [true, "Please enter description"],
  },
  price: {
    type: Number,
    require: [true, "Enter price of products"],
    maxLength: [8, "Price should not exceed 8 figures"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  category: {
    type: String,
    require: [true, "Please enter Product category"],
  },
  stock: {
    type: Number,
    require: [true, "Please enter product stock"],
    maxLength: [4, "Stock should not exceed 4 figures"],
  },
  numOfreviews: {
    type: Number,
    default: 0,
  },
  reviews: {
    name: {
      type: String,
      require: [true, "Please enter your name"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      require: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", schema);
