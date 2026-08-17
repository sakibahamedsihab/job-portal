const express = require("express");
const {
  createCompany,
  updateCompany,
  getCompanies,
  getMyCompnay,
} = require("../controllers/companyController.js");

const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

const router = express.Router();

router.post("/", requireAuth, roleCheck(["recruiter"]), createCompany);
router.get("/", getCompanies);
router.get("/me", requireAuth, roleCheck(["recruiter"]), getMyCompnay);
router.put("/me", requireAuth, roleCheck(["recruiter"]), updateCompany);

module.exports = router;