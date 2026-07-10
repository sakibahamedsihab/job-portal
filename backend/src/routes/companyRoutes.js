const express = require("express");
const {
  createCompany,
  getCompanies,
} = require("../controllers/companyController.js");
const { route } = require("../app.js");

const router = express.Router();

router.post("/", createCompany);
router.get("/", getCompanies);

module.exports = router;
