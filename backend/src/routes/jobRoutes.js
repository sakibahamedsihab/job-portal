const express = require("express");
const router = express.Router();

const {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
} = require("../controllers/jobControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

router.post("/", requireAuth, roleCheck(["recruiter"]), createJob);
router.get("/", getJobs);
router.get("/me", requireAuth, roleCheck(["recruiter"]), getMyJobs);
router.get("/:id", getJobById);

module.exports = router;