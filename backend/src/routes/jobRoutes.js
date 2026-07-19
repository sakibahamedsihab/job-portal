const express = require("express");
const router = express.Router();

const {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
} = require("../controllers/jobControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");

router.post("/", requireAuth, createJob);
router.get("/", getJobs);
router.get("/me", requireAuth, getMyJobs);
router.get("/:id", getJobById);

module.exports = router;
