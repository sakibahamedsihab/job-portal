// src/controllers/applicationControllers.js
//
// This file handles everything related to job applications.
// There are 3 main actors:
//   1. The SEEKER — applies to jobs, views their own applications
//   2. The RECRUITER — views applicants who applied to their jobs
//
// The "applications" MongoDB collection will store documents like:
// {
//   jobId:     ObjectId,   // which job was applied to
//   seekerId:  string,     // Better Auth user ID of the seeker
//   status:    string,     // "pending" | "reviewing" | "rejected" | "accepted"
//   appliedAt: Date,       // when the seeker applied
//
//   // Denormalised fields (copied from job/user at time of apply)
//   // so that we can display them without extra lookups later
//   jobTitle:     string,
//   companyName:  string,
//   seekerName:   string,
//   seekerEmail:  string,
// }

const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

// ─────────────────────────────────────────────────────────────────────────────
// applyToJob
//
// Called when a SEEKER hits "Apply" on a job detail page.
// Route: POST /api/applications   (seeker only)
//
// What it does:
//   1. Validates that the job ID is a valid MongoDB ObjectId format
//   2. Looks up the job to make sure it actually exists
//   3. Prevents the same seeker from applying twice to the same job
//   4. Looks up the seeker's name/email from the "user" collection (Better Auth stores it there)
//   5. Inserts a new application document into the "applications" collection
// ─────────────────────────────────────────────────────────────────────────────
const applyToJob = async (req, res) => {
  try {
    const db = getDB();

    // req.user is attached by requireAuth middleware from the session cookie
    const seekerId = req.user.id;

    // The jobId comes from the request body (the frontend sends it)
    const { jobId } = req.body;

    // ── Step 1: Validate the jobId format ────────────────────────────────────
    // MongoDB ObjectId has a specific 24-character hex format.
    // If we skip this check and pass a bad ID to findOne, MongoDB will throw.
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format.",
      });
    }

    // ── Step 2: Find the job to make sure it exists ───────────────────────────
    const job = await db
      .collection("jobs")
      .findOne({ _id: new ObjectId(jobId) });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ── Step 3: Prevent duplicate applications ────────────────────────────────
    // A seeker should only be able to apply once per job.
    // We search for an existing application with the same seekerId + jobId pair.
    const existingApplication = await db.collection("applications").findOne({
      jobId: new ObjectId(jobId), // store as ObjectId for consistent querying
      seekerId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job.",
      });
    }

    // ── Step 4: Get the seeker's name & email ─────────────────────────────────
    // Better Auth stores users in the "user" collection (singular).
    // We look them up by their string ID (Better Auth uses string IDs, not ObjectId).
    // We denormalise name/email into the application so the recruiter can display
    // them without doing an extra join later.
    const seeker = await db.collection("user").findOne({ id: seekerId });

    // ── Step 5: Insert the application document ───────────────────────────────
    const applicationPayload = {
      jobId: new ObjectId(jobId),      // store as ObjectId for proper indexing
      seekerId,                         // string — Better Auth user ID
      status: "pending",               // default status when first applied

      // Denormalised job info (snapshot at time of apply)
      // This way even if the job title changes later, we keep the original
      jobTitle: job.title,
      companyName: job.companyName,

      // Denormalised seeker info (so recruiter can see who applied)
      seekerName: seeker?.name || "Unknown",
      seekerEmail: seeker?.email || "Unknown",

      appliedAt: new Date(),
    };

    const result = await db
      .collection("applications")
      .insertOne(applicationPayload);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: result.insertedId,
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getMyApplications
//
// Called when a SEEKER visits their "Applied Jobs" dashboard page.
// Route: GET /api/applications/me   (seeker only)
//
// What it does:
//   1. Finds all application documents where seekerId matches the logged-in user
//   2. Returns them sorted by most recently applied (newest first)
//   3. The frontend will use this to show job title, company, status, date, etc.
// ─────────────────────────────────────────────────────────────────────────────
const getMyApplications = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;

    // Find all applications for this seeker, newest first
    // We don't need to do a JOIN here because we denormalised job/company
    // info into the application document at the time of apply (see applyToJob above)
    const applications = await db
      .collection("applications")
      .find({ seekerId })
      .sort({ appliedAt: -1 }) // -1 = descending = newest first
      .toArray();

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching my applications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getJobApplicants
//
// Called when a RECRUITER clicks "View Applicants" on one of their job posts.
// Route: GET /api/applications/job/:jobId   (recruiter only)
//
// What it does:
//   1. Validates the jobId format
//   2. Verifies the job exists AND belongs to this recruiter
//      → This is a security check: a recruiter should not be able to view
//        applicants for someone else's job
//   3. Returns all applications for that job, newest first
// ─────────────────────────────────────────────────────────────────────────────
const getJobApplicants = async (req, res) => {
  try {
    const db = getDB();
    const recruiterId = req.user.id;

    // jobId comes from the URL: /api/applications/job/:jobId
    const { jobId } = req.params;

    // ── Step 1: Validate jobId format ─────────────────────────────────────────
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format.",
      });
    }

    // ── Step 2: Verify the job belongs to the requesting recruiter ────────────
    // We look for a job with BOTH the given _id AND the recruiterId.
    // If the job exists but belongs to a different recruiter, findOne returns null
    // and we return 403 Forbidden — protecting other recruiters' data.
    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(jobId),
      recruiterId,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "Job not found or you do not have permission to view it.",
      });
    }

    // ── Step 3: Fetch all applications for this job ───────────────────────────
    const applicants = await db
      .collection("applications")
      .find({ jobId: new ObjectId(jobId) })
      .sort({ appliedAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      jobTitle: job.title,
      applicants,
    });
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Export all three controller functions so the routes file can import them
module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
};
