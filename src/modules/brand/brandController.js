import { brandModel } from "../../../DB/models/brandModel.js";
import { asyncHandler } from "../../utilities/asynchandler.js";
import { categoryModel } from "./../../../DB/models/categorymodel.js";
import cloudinary from "./../../utilities/cloud.js";
import slugify from "slugify";
export const createBrand = asyncHandler(async (req, res, next) => {
  //* check cateegories
  const { categories, name } = req.body; //*[ "adssdsaddas", "sdsadsdas"]
  categories.forEach(async (categoryId) => {
    const category = await categoryModel.findById(categoryId);
    if (!category)
      return next(
        new Error(`category ${categoryId} not found`, { cause: 404 })
      );
  });
  //*check file
  if (!req.file)
    return next(new Error("brand image is required", { cause: 400 }));
  //*upload file on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/brand` }
  );

  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });

  //*save brand in each category

  categories.forEach(async (categoryId) => {
    const category = await categoryModel.findByIdAndUpdate(categoryId, {
      $push: { brands: brand._id },
    });
    /*     category.brands.push(brand._id);
    await category.save(); */
  });

  return res.json({ success: true, message: "brand created successfully" });
});

//update brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.id);
  if (!brand) return next(new Error("brand not found", { cause: 404 }));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );
    brand.image = { url: secure_url, id: public_id };
  }

  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  await brand.save();

  return res.json({ success: true, message: "brand updated successfully" });
});

//delete brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.id);
  if (!brand) return next(new Error("brand not found", { cause: 400 }));

  //delete brand from db
  await brand.deleteOne();
  //delete brandimage from cloudinary
  await cloudinary.uploader.destroy(brand.image.id);
  //delete brand from each category

  await categoryModel.updateMany({}, { $pull: { brands: brand._id } });

  return res.json({ success: true, message: "brand deleted successfully" });
});

//get brands
export const getBrand = asyncHandler(async (req, res, next) => {
  const results = await brandModel.find();
  return res.json({ success: true, results });
});
