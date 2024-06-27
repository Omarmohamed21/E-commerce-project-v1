import { Router } from "express";

import { validation } from "./../../middlewares/validation.js";
import * as authSchema from "./authVaSchema.js";
import * as authcontroller from "./authController.js";
const router = Router();

//signup
router.post(
  "/register",
  validation(authSchema.register),
  authcontroller.register
);

//activation link
router.get(
  "/activate_account/:token",
  validation(authSchema.activateAccount),
  authcontroller.activateAccount
);

//login
router.post("/login", validation(authSchema.login), authcontroller.login);

router.patch(
  "/forget_code",
  validation(authSchema.forgetCode),
  authcontroller.forgetCode
);

router.patch(
  "/reset_password",
  validation(authSchema.resetPassword),
  authcontroller.resetPassword
);
export default router;
