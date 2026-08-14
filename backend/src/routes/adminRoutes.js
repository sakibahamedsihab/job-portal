const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAdminUsers,
  getAdminJobs,
  deleteJobAdmin,
  deleteUserAdmin,
} = require("../controllers/adminControllers.js");
const requireAuth = require("../middlewares/requireAuth.js");
const roleCheck = require("../middlewares/roleCheck.js");

router.use(requireAuth);
router.use(roleCheck(["admin"]));

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/jobs", getAdminJobs);
router.delete("/jobs/:id", deleteJobAdmin);
router.delete("/users/:id", deleteUserAdmin);

module.exports = router;