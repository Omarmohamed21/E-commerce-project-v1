import slugify from "slugify";

import { asyncHandler } from "../../utilities/asynchandler.js";
import cloudinary from "../../utilities/cloud.js";
import { subCategoryModel } from "../../../DB/models/subcategoryModel.js";
import { categoryModel } from "../../../DB/models/categorymodel.js";

//create subCategory
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.category);
  if (!category) return next(new Err());

  if (!req.file) {
    return next(new Error("sub category is required", { cause: 404 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`,
    }
  );

  await subCategoryModel.create({
    name: req.body.name,
    category: req.params.category,
    slug: slugify(req.body.name),
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
  });

  return res.json({
    success: true,
    message: "subCategory created successfully",
  });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  const subCategory = await subCategoryModel.findOne({
    _id: req.params.id,
    category: req.params.category,
  });

  if (!subCategory)
    return next(new Error("sub category not found", { cause: 404 }));

  if (req.user._id.toString() !== subCategory.createdBy.toString())
    return next(new Error("you'r not the owner of the sub category"));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subCategory.image.id,
      }
    );
    subCategory.image = { id: public_id, url: secure_url };
  }

  subCategory.name = req.body.name ? req.body.name : subCategory.name;
  subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug;

  await subCategory.save();

  return res.json({ success: true, message: "updated successfully" });
});

//delete
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  const subcategory = await subCategoryModel.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("sub category not found", { cause: 404 }));

    if (subcategory.createdBy.toString() !== req.user._id.toString())
    return next(
      new Error("you're not authorized to do this action", { cause: 401 })
    ); 
  await subcategory.deleteOne();

  await cloudinary.uploader.destroy(subcategory.image.id);

  return res.json({
    success: true,
    message: "subcategory deleted successfully",
  });
});

export const allCategories = asyncHandler(async (req, res, next) => {
  if (req.params.category !== undefined) {
    //*get all sub categories related to certain category
    const category = await categoryModel.findById(req.params.category);
    if (!category) return next(new Error("category not found", { cause: 404 }));
    const results = await subCategoryModel.find({
      category: req.params.category,
    });
    return res.json({ success: true, results });
  }

  /*   const results = await subCategoryModel.find().populate([
    { path: "category", select: "name -_id" },
    { path: "createdBy", select: "name-_id" },
  ]);//*multiple populate */
  const results = await subCategoryModel
    .find()
    .populate([
      { path: "category", populate: [{ path: "createdBy", select: "email" }] },
    ]); //*nested populate
  return res.json({ success: true, results });
});
