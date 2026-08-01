// src/routes/applicationRoutes.js
//
// This file defines the HTTP routes for everything related to applications.
// It glues together:
//   - Express Router (defines which URL + method triggers which controller)
//   - requireAuth middleware (ensures the request has a valid session before running the controller)
//   - The three controller functions from applicationControllers.js
//
// Route summary:
//
//   POST   /api/applications              → applyToJob        (seeker submits application)
//   GET    /api/applications/me           → getMyApplications  (seeker views their own applications)
//   GET    /api/applications/job/:jobId   → getJobApplicants   (recruiter views applicants for a job)
//
// All three routes require authentication because:
//   - applyToJob needs to know WHICH seeker is applying
//   - getMyApplications needs to know WHICH seeker's applications to fetch
//   - getJobApplicants needs to verify the recruiter OWNS that job (security)

const express = require("express");
const router = express.Router();

// Import the three controller functions
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
} = require("../controllers/applicationControllers.js");

// Import the auth middleware
// requireAuth reads the better-auth.session_token cookie from the request,
// validates it in MongoDB, and attaches req.user = { id, email, name, role }
// before passing control to the controller function.
// If the cookie is missing or invalid, it stops the request and returns 401.
const requireAuth = require("../middlewares/requireAuth.js");

// ── Route 1: Apply to a job ───────────────────────────────────────────────────
// POST /api/applications
// Body: { jobId: "..." }
// Only a logged-in seeker should call this.
// requireAuth runs first → validates session → then applyToJob runs.
router.post("/", requireAuth, applyToJob);

// ── Route 2: Seeker views their own applications ──────────────────────────────
// GET /api/applications/me
// IMPORTANT: This route MUST be defined BEFORE /:jobId below.
// Express matches routes in order. If /:jobId came first, "me" would be
// treated as the jobId parameter and the wrong controller would run.
router.get("/me", requireAuth, getMyApplications);

// ── Route 3: Recruiter views applicants for one of their jobs ─────────────────
// GET /api/applications/job/:jobId
// The :jobId is a URL parameter — Express extracts it into req.params.jobId
// The controller will validate that this job belongs to the requesting recruiter.
router.get("/job/:jobId", requireAuth, getJobApplicants);

module.exports = router;
