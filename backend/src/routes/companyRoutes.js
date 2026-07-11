const express = require("express");
const {
  createCompany,
  getCompanies,
  getMyCompnay,
} = require("../controllers/companyController.js");
const { route } = require("../app.js");

const requireAuth = require("../middlewares/requireAuth.js");

const router = express.Router();

router.post("/", requireAuth, createCompany);
router.get("/", getCompanies);
router.get("/me", requireAuth, getMyCompnay);

module.exports = router;
