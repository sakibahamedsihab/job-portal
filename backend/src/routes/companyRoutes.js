const express = require("express");
const {
  createCompany,
  getCompanies,
  getMyCompnay,
} = require("../controllers/companyController.js");

const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

const router = express.Router();

router.post("/", requireAuth, roleCheck(["recruiter"]), createCompany);
router.get("/", getCompanies);
router.get("/me", requireAuth, roleCheck(["recruiter"]), getMyCompnay);

module.exports = router;