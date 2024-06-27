import joi from "joi";
/* import { objectIdValidation } from "../../middlewares/validation"; */

//create Coupon
export const createCoupon = joi
  .object({
    discount: joi
      .number()
      .integer()
      .options({ convert: false }) // to don,t allow conversion of string to number like "123" to 123
      .min(1)
      .max(100)
      .required(),
    expiredAt: joi.date().greater(Date.now()).required(),
  })
  .required();

export const updateCoupon = joi
  .object({
    code: joi.string().length(5).required(),
    discount: joi.number().integer().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();

export const deletecoupon = joi
  .object({
    code: joi.string().length(5).required(),
  })
  .required();
  
// export const createCoupon = joi.object({}).required();
