import jwt from "jsonwebtoken";

import { asyncHandler } from "../utilities/asynchandler.js";
import { tokenModel } from "../../DB/models/tokenModel.js";
import { userModel } from "../../DB/models/userModel.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];

  if (!token || !token.startsWith(process.env.BEARER_key))
    return next(new Error("valid token is required", { cause: 404 }));

  token = token.split(process.env.BEARER_key)[1];
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  const tokenDB = await tokenModel.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("invalid token", { cause: 401 }));

  const user = await userModel.findById(payload.id);
  if (!user) return next(new Error("user not found", { cause: 404 }));

  req.user = user;

  return next();
});
