import voucherCodes from "voucher-code-generator";

import { asyncHandler } from "../../utilities/asynchandler.js";
import { couponModel } from "./../../../DB/models/couponModel.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucherCodes.generate({ length: 5 }); //return an array //*so when we store it we must store it like this code[0]

  const coupon = await couponModel.create({
    name: code[0],
    createdBy: req.user._id,
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
  });

  return res.json({ success: true, results: { coupon } });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  //check coupon
  const coupon = await couponModel.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });

  if (!coupon) return next(new Error("expired coupon", { cause: 404 }));

  //check owner
  //*we can replace req.user._id.toString() with req.user.id
  if (req.user._id.toString() !== coupon.createdBy.toString())
    return next(new Error("not authorize", { cause: 403 }));

  //upddate
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();

  return res.json({ success: true, messsage: "updated successfully" });
});

export const deletecoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({ name: req.params.code });
  if (!coupon) return next(new Error("coupon is not found", { cause: 404 }));

  if (req.user._id.toString() !== coupon.createdBy.toString())
    return next(new Error("you're not authorized to", { cause: 403 }));

  await coupon.deleteOne();

  return res.json({ success: true, messsage: "coupon deleted successfully" });
});

export const getCoupons = asyncHandler(async (req, res, next) => {
  if (req.user.role === "addmin") {
    const coupons = await couponModel.find();
    return res.json({ success: true, results: { coupons } });
  }

  if (req.user.role === "seller") {
    const coupons = await couponModel.find({ createdBy: req.user._id });
    
    return res.json({ success: true, results: { coupons } });
  }
});
