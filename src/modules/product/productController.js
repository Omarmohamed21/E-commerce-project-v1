import { categoryModel } from "../../../DB/models/categorymodel.js";
import { brandModel } from "../../../DB/models/brandModel.js";
import { subCategoryModel } from "../../../DB/models/subcategoryModel.js";
import { productModel } from "../../../DB/models/productModel.js";
import { asyncHandler } from "../../utilities/asynchandler.js";
import { nanoid } from "nanoid";
import cloudinary from "../../utilities/cloud.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  //*check category
  const category = await categoryModel.findById(req.body.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));
  //*check sub category
  const subCategory = await subCategoryModel.findById(req.body.subCategory);
  if (!subCategory)
    return next(new Error("subCategory not found", { cause: 404 }));
  //*check brand
  const brand = await brandModel.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found", { cause: 404 }));
  //*check files
  if (!req.files)
    //this is files not files because it is not a single image
    return next(new Error("image is required", { cause: 400 }));
  //*create folder name  unique
  const cloudFolder = nanoid();

  let images = [];
  //*upload sub images
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  //*upload defaultimages
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  );

  //*create product
  const product = await productModel.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { id: public_id, url: secure_url },
    images,
  });

  return res.json({ success: true, message: "product created successfully" });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product

  const product = await productModel.findById(req.params.id);
  if (!product) return next(new Error("product not found", { cause: 404 }));
  // check owner
  if (req.user.id !== product.createdBy.toString())
    return next(
      new Error("you,re not authorized to do this action", { cause: 403 })
    );

  //delete product
  await product.deleteOne();

  //to delete all images of product from cloudinary
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_resources(ids);

  //to delete folders created on cloudinary
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  ); //it cannot delete the folder if the folder has images so we make the step from line 69 to 71

  return res.json({ success: true, message: "product deleted successfully" });
});

export const allproducts = asyncHandler(async (req, res, next) => {
  const results = await productModel.find();
  return res.json({ success: true, results });
});
