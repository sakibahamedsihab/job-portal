const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationControllers.js");

const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

router.post("/", requireAuth, roleCheck(["seeker"]), applyToJob);
router.get("/me", requireAuth, roleCheck(["seeker"]), getMyApplications);
router.get("/job/:jobId", requireAuth, roleCheck(["recruiter"]), getJobApplicants);
router.patch("/:id/status", requireAuth, roleCheck(["recruiter"]), updateApplicationStatus);

module.exports = router;