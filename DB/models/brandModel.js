import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, unique: true, required: true, min: 2, max: 12 },
    slug: { type: String, required: true, unique: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "user " },
  },
  { timestamps: true }
);

export const brandModel = model("brand", brandSchema);
