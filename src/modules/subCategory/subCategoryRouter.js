import { Router } from "express";

import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import { fileUpload } from "../../utilities/fileUploads.js";
import * as subCategorySchema from "./subCategorySchema.js";
import * as subCategoryController from "./subCategoryController.js";

const router = Router({ mergeParams: true });

//createcategory
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subCategorySchema.createSubCategory),
  subCategoryController.createSubCategory
);

//update
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subCategorySchema.updateSubCategory),
  subCategoryController.updateSubCategory
);

//delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(subCategorySchema.deleteSubCategory),
  subCategoryController.deleteSubCategory
);

//get all categories
router.get(
  "/",
  validation(subCategorySchema.getSubCategories),
  subCategoryController.allCategories
);

export default router;
