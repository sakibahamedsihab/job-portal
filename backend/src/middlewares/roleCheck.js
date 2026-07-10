const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Unauthorized Access" });
    } else {
      res.json({ message: "Access granted" });
      next();
    }
  };
};

module.exports = roleCheck;
