export const isAuthorized = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new Error("you're not authorized", { cause: 403 }));

    return next();
  };
};
