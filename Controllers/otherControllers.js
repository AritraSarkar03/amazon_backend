import { CatchAsyncError } from "../Middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

export const contact = CatchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return next(new ErrorHandler("Please enter all fields", 400));

  const to = process.env.MY_MAIL;
  const subject = "Contact from LearnTube";
  const text = `I am ${name} and my Email is ${email}. \n${message}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your message has been sent.",
  });
});
