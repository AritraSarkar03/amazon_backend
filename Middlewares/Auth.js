import jwt from "jsonwebtoken";
import { CatchAsyncError } from "./CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../Models/User.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "active" && req.user.role !== "admin")
    return next(new ErrorHandler(`Only subscribers can access this resource`, 403));

  next();
};
