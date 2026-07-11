const express = require("express");
const router = express.Router();

const { createJob, getMyJobs } = require("../controllers/jobControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");

router.post("/", requireAuth, createJob);
router.get("/me", requireAuth, getMyJobs);

module.exports = router;
