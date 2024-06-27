import joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.js";

//create
export const createCategory = joi
  .object({
    name: joi.string().min(5).max(20).required(),
  })
  .required();

//update
export const updateCategory = joi
  .object({
    name: joi.string().min(5).max(20),
    id: joi.string().custom(objectIdValidation).required(),
  })
  .required();

export const deleteCategory = joi.object({
  id: joi.string().custom(objectIdValidation).required(),
}).required();
