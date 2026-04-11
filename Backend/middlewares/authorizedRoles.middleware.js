export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized request",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};