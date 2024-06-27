import { asyncHandler } from "../../utilities/asynchandler.js";
import cloudinary from "./../../utilities/cloud.js";
import { categoryModel } from "./../../../DB/models/categorymodel.js";

import slugify from "slugify";

//create
export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file)
    return next(new Error("category image is required", { cause: 400 }));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
    }
  );

  await categoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });

  return res.json({ success: true, message: "category created successfully" });
});

//update
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) return next(new Error("category nnot found", { cause: 404 }));

  if (req.user._id.toString() !== category.createdBy.toString())
    return next(
      new Error("you're not the owner of the category", { cause: 403 })
    );

  /* update category photo */
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.id,
      }
    );
    category.image = { id: public_id, url: secure_url };
  }
  //update category name
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  await category.save();

  //return response
  return res.json({ success: true, message: "category updated successfully" });
});

//delete
export const deleteCategory = asyncHandler(async (req, res, next) => {
  //find category
  const category = await categoryModel.findById(req.params.id);
  if (!category) return next(new Error("category not Found", { cause: 404 }));
  //check owner of the category
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("you're not the owner", { cause: 403 }));

  //delete category from the database
  await categoryModel.findByIdAndDelete(req.params.id);

  //delete from cloudinary
  await cloudinary.uploader.destroy(category.image.id);

  //send response
  return res.json({ success: true, message: "Category deleted successfully" });
});

//get all categorys
export const allcategories = asyncHandler(async (req, res, next) => {
  const results = await categoryModel.find().populate("subcategory");
  return res.json({ success: true, results });
});
