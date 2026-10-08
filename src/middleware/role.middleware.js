export const authorize = (...allowedRoutes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoutes.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};
