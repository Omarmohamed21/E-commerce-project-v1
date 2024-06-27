import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 20 },
    description: { type: String, min: 10, max: 200 },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: String, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
    brand: { type: Types.ObjectId, ref: "category", required: true },
    subCategory: { type: Types.ObjectId, ref: "subcategory", required: true },
    brand: { type: Types.ObjectId, ref: "brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("finalprice").get(function () {
  //   if (this.discount > 0) {
  //     return this.price - (this.price * this.discount) / 100;
  //}

  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

export const productModel = model("product", productSchema);
