import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Randomstring from "randomstring";

import { asyncHandler } from "./../../utilities/asynchandler.js";
import { userModel } from "./../../../DB/models/userModel.js";
import { sendEmail } from "./../../utilities/sendEmails.js";
import { tokenModel } from "./../../../DB/models/tokenModel.js";

//signup
export const register = asyncHandler(async (req, res, next) => {
  //checl user email
  const user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new Error("user already existed"), { cause: 409 });

  //generate token
  const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);

  //create user
  await userModel.create({ ...req.body});

  //create confirmation link
  const confirmationLink = `http://localhost:3000/auth/activate_account/${token}`;

  const messageSent = await sendEmail({
    to: req.body.email,
    subject: "activate your account",
    html: `<a href= ${confirmationLink}> activate your account</a>`,
  });

  if (!messageSent) return next(new Error("something went wrong"));
  return res.status(201).json({ success: true, message: "check your email" });
});

//account activation
export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.SECRET_KEY);

  const user = await userModel.findOneAndUpdate(
    { email },
    { isConfirmed: true }
  );

  if (!user) return next(new Error("user not found"), { cause: 404 });

  //create cart // TODO

  return res.json({ success: true, message: "try to log in now" });
});

//login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("invalid email"), { cause: 404 });

  if (!user.isConfirmed)
    return next(new Error("you should activate your account first"), {
      cause: 401,
    });
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("password incorrect"), { cause: 404 });

  const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY, {expiresIn: "30m"});
  await tokenModel.create({ token, user: user._id });

  return res.json({ success: true, result: { token } });
});

export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("invalid email", { cause: 401 }));

  const forgetCode = Randomstring.generate({
    charset: "numeric",
    length: 5,
  });

  user.forgetCode = forgetCode;
  await user.save();

  const sendMessage = await sendEmail({
    to: email,
    subject: "forget code",
    html: `<div>${forgetCode}</div`,
  });

  if (!sendMessage)
    return next(new Error("something went wrong", { Cause: 400 }));

  return res.json({
    success: true,
    message: "check your email so you can reset your password now",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("invalid email", { cause: 404 }));
  if (forgetCode !== user.forgetCode)
    return next(new Error("incorrect code", { cause: 401 }));

 

  const tokens = await tokenModel.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  /*   await userModel.findByIdAndDelete(user._id, { forgetCode }); */

  return res.json({ success: true, message: "try to log in now " });
});
