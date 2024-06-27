import { Router } from "express";

import { isAuthenticated } from "./../../middlewares/authentication.js";
import { isAuthorized } from "./../../middlewares/authorization.js";
import { fileUpload } from "../../utilities/fileUploads.js";
import { validation } from "./../../middlewares/validation.js";
import * as categoryController from "./categoryController.js";
import * as categorySchema from "./categoryVaSchema.js";
import subCategoryRouter from "./../subCategory/subCategoryRouter.js";

const router = Router();

//
router.use("/:category/subcategory", subCategoryRouter);

//create category
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.createCategory),
  categoryController.createCategory
);

//update category
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.updateCategory),
  categoryController.updateCategory
);

//delete category
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.deleteCategory),
  categoryController.deleteCategory
);

router.get("/", categoryController.allcategories);
export default router;
