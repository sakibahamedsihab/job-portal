// backend/src/routes/savedJobRoutes.js
const express = require("express");
const router = express.Router();

const {
  toggleSaveJob,
  getMySavedJobs,
  checkIsJobSaved,
} = require("../controllers/savedJobControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");

// POST /api/saved-jobs/toggle → Bookmark or un-bookmark a job
router.post("/toggle", requireAuth, toggleSaveJob);

// GET /api/saved-jobs/me → List seeker's saved jobs
router.get("/me", requireAuth, getMySavedJobs);

// GET /api/saved-jobs/check/:jobId → Check if job is bookmarked
router.get("/check/:jobId", requireAuth, checkIsJobSaved);

module.exports = router;
