import { Router } from "express";

import * as brandController from "./brandController.js";
import * as brandSchema from "./brandSchema.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { fileUpload } from "../../utilities/fileUploads.js";
import { validation } from "../../middlewares/validation.js";

const router = Router();

//CRUD

//create Brand
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.createBrand),
  brandController.createBrand

);

//update brand
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);

//delete brand
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);

//get brands
router.get("/", brandController.getBrand)

export default router;
