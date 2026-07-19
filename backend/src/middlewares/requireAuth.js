// jsonwebtoken

const requireAuth = (req, res, next) => {
  // MOCK AUTHENTICATION

  // Dummy User
  req.user = {
    id: "recruiter_dummy_101",
    email: "recruiter@test.com",
    role: "recruiter",
  };

  console.log("[Mock Auth] Dummy user attached to request.");

  next();
};

module.exports = requireAuth;
