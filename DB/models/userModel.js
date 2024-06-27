import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male ", "female"],
    },
    phone: {
      type: String,
      /* required: true */
    },
    role: {
      type: String,
      enum: ["seller", "user", "admin"],
      default: "user",
    },
    forgetCode: { type: String },
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dlkkim4of/image/upload/v1709663694/amazonnjumia/users/defaults/profile%20pictures/pp_pxq2s5.jpg",
      },
      id: {
        type: String,
        default: "amazonnjumia/users/defaults/profile%20pictures/pp_pxq2s5",
      },
    },
    coverPhotos: [{ url: { type: String }, id: { type: String } }],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
});
export const userModel = model("user", userSchema);
