import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    discount: { type: Number, required: true, min: 1, max: 100 },
    expiredAt: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const couponModel = model("coupon", couponSchema);
