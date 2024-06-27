import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "user" },
    isValid: { type: String, default: true },
    agent: String,
    expiredAt: String,
  },
  { timestamps: true }
);

export const tokenModel = model("token", tokenSchema);
