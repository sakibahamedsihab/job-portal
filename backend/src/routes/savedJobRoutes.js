const express = require("express");
const router = express.Router();

const {
  toggleSaveJob,
  getMySavedJobs,
  checkIsJobSaved,
} = require("../controllers/savedJobControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

router.post("/toggle", requireAuth, roleCheck(["seeker"]), toggleSaveJob);
router.get("/me", requireAuth, roleCheck(["seeker"]), getMySavedJobs);
router.get("/check/:jobId", requireAuth, roleCheck(["seeker"]), checkIsJobSaved);

module.exports = router;