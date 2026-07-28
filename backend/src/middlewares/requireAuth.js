// jsonwebtoken

const requireAuth = (req, res, next) => {
  // Dummy User
  req.user = {
    id: "recruiter_dummy_501",
    email: "recruiter@test.com",
    role: "seeker",
  };

  console.log("[Mock Auth] Dummy user attached to request.");

  next();
};

module.exports = requireAuth;
