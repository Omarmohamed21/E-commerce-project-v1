import { Router } from "express";

import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import * as couponSchema from "./couponSchema.js";
import * as couponController from "./couponController.js";

const router = Router();

//create coupon
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.createCoupon),
  couponController.createCoupon
);

router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon
);

router.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.deletecoupon),
  couponController.deletecoupon
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("seller", "admin"),
  couponController.getCoupons
);
export default router;
