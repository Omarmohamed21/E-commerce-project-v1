import { Router } from "express";

import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import { fileUpload } from "../../utilities/fileUploads.js";
import * as productController from "./productController.js";
import * as productSchema from "./productSchema.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  productController.createProduct
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("seller"),
  validation(productSchema.deleteProduct),
  productController.deleteProduct
);

router.get("/", productController.allproducts);
export default router;
