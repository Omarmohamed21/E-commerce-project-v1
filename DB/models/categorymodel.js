import { Schema, Types, model } from "mongoose";
import { subCategoryModel } from "./subcategoryModel.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
    image: { id: { type: String }, url: { type: String } },
    brands: [{ type: Types.ObjectId, ref: "brand" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//hook , when we delete category by logic we need to delete all subcategories related to this category
categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const subCategory = await subCategoryModel.deleteMany({
      category: this._id,
    });
  }
);

categorySchema.virtual("subcategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});
export const categoryModel = model("category", categorySchema);
