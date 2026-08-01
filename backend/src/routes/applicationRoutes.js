// src/routes/applicationRoutes.js
//
// This file defines the HTTP routes for everything related to applications.
// It glues together:
//   - Express Router (defines which URL + method triggers which controller)
//   - requireAuth middleware (ensures the request has a valid session before running the controller)
//   - Controller functions from applicationControllers.js
//
// Route summary:
//   POST   /api/applications              → applyToJob              (seeker applies)
//   GET    /api/applications/me           → getMyApplications        (seeker views applications)
//   GET    /api/applications/job/:jobId   → getJobApplicants         (recruiter views applicants)
//   PATCH  /api/applications/:id/status   → updateApplicationStatus  (recruiter accepts/rejects candidate)

const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationControllers.js");

const requireAuth = require("../middlewares/requireAuth.js");

// ── Route 1: Apply to a job ───────────────────────────────────────────────────
router.post("/", requireAuth, applyToJob);

// ── Route 2: Seeker views their own applications ──────────────────────────────
router.get("/me", requireAuth, getMyApplications);

// ── Route 3: Recruiter views applicants for one of their jobs ─────────────────
router.get("/job/:jobId", requireAuth, getJobApplicants);

// ── Route 4: Recruiter updates candidate application status ───────────────────
// PATCH /api/applications/:id/status
// Body: { status: "pending" | "reviewing" | "accepted" | "rejected" }
router.patch("/:id/status", requireAuth, updateApplicationStatus);

module.exports = router;
