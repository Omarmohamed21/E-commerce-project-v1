import joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.js";

export const createSubCategory = joi
  .object({
    name: joi.string().min(5).max(20).required(),
    category: joi.string().custom(objectIdValidation).required(),
  })
  .required();

export const updateSubCategory = joi
  .object({
    name: joi.string().min(5).max(20),
    category: joi.string().custom(objectIdValidation).required(),
    id: joi.string().custom(objectIdValidation).required(),
  })
  .required();

export const deleteSubCategory = joi
  .object({
    category: joi.string().custom(objectIdValidation).required(),
    id: joi.string().custom(objectIdValidation).required(),
  })
  .required();

export const getSubCategories = joi
  .object({
    category: joi.string().custom(objectIdValidation),
  })
  .required();
