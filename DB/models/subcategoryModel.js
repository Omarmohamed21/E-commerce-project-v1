import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
    image: { id: { type: String }, url: { type: String } },
    category: { type: Types.ObjectId, ref: "category", required: true },
    brands: [{ type: Types.ObjectId, ref: "brand" }],
  },
  { timestamps: true }
);

export const subCategoryModel = model("subCategory", subCategorySchema);
