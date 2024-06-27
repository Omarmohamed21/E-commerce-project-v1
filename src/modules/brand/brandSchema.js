import joi from "joi";

import { objectIdValidation } from "../../middlewares/validation.js";

//create brand

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(12).required(),
    categories: joi
      .array()
      .items(joi.string().custom(objectIdValidation).required())
      .required(),
  })
  .required();

export const updateBrand = joi
  .object({
    id: joi.string().custom(objectIdValidation).required(),
    name: joi.string().min(2).max(12),
  })
  .required();

  //delete brand
export const deleteBrand = joi
  .object({
    id: joi.string().custom(objectIdValidation).required(),
  })
  .required();
