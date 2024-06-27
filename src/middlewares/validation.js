import { Types } from "mongoose";

export const objectIdValidation = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;

  return helper.message("invalid ID");
};

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };

    const validationResult = schema.validate(data, { abortEarly: false });

    if (validationResult.error) {
      const errorMessage = validationResult.error.details.map(
        (errorobj) => errorobj.message
      );
      return next(new Error(errorMessage, { cause: 400 }));
    }
    return next();
  };
};
