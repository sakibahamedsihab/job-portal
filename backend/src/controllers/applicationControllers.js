// src/controllers/applicationControllers.js
//
// This file handles everything related to job applications.
// There are 3 main actors:
//   1. The SEEKER — applies to jobs, views their own applications
//   2. The RECRUITER — views applicants who applied to their jobs, updates candidate status
//
// The "applications" MongoDB collection stores documents like:
// {
//   jobId:     ObjectId,   // which job was applied to
//   seekerId:  string,     // Better Auth user ID of the seeker
//   status:    string,     // "pending" | "reviewing" | "rejected" | "accepted"
//   appliedAt: Date,       // when the seeker applied
//   updatedAt: Date,       // last status change timestamp
//
//   // Denormalised fields
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
// ─────────────────────────────────────────────────────────────────────────────
const applyToJob = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;
    const { jobId } = req.body;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format.",
      });
    }

    const job = await db
      .collection("jobs")
      .findOne({ _id: new ObjectId(jobId) });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const existingApplication = await db.collection("applications").findOne({
      jobId: new ObjectId(jobId),
      seekerId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job.",
      });
    }

    const seeker = await db.collection("user").findOne({ id: seekerId });

    const applicationPayload = {
      jobId: new ObjectId(jobId),
      seekerId,
      status: "pending",
      jobTitle: job.title,
      companyName: job.companyName || job.company || "Company",
      seekerName: seeker?.name || "Unknown Candidate",
      seekerEmail: seeker?.email || "Unknown Email",
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
// ─────────────────────────────────────────────────────────────────────────────
const getMyApplications = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;

    const applications = await db
      .collection("applications")
      .find({ seekerId })
      .sort({ appliedAt: -1 })
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
// ─────────────────────────────────────────────────────────────────────────────
const getJobApplicants = async (req, res) => {
  try {
    const db = getDB();
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format.",
      });
    }

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

// ─────────────────────────────────────────────────────────────────────────────
// updateApplicationStatus
//
// Called when a RECRUITER changes candidate status (Accept / Reject / Reviewing / Pending).
// Route: PATCH /api/applications/:id/status   (recruiter only)
// Body: { status: "pending" | "reviewing" | "accepted" | "rejected" }
//
// Security check:
//   - Verifies the candidate application exists
//   - Verifies the job belongs to the logged-in recruiter (prevents modifying unauthorized applications)
// ─────────────────────────────────────────────────────────────────────────────
const updateApplicationStatus = async (req, res) => {
  try {
    const db = getDB();
    const recruiterId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ["pending", "reviewing", "accepted", "rejected"];

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format.",
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const formattedStatus = status.toLowerCase();

    // 1. Find the application document
    const application = await db.collection("applications").findOne({
      _id: new ObjectId(id),
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // 2. Security check: confirm the recruiter owns the job for this application
    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(application.jobId),
      recruiterId,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this application.",
      });
    }

    // 3. Update status in MongoDB
    await db.collection("applications").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: formattedStatus,
          updatedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Status updated to '${formattedStatus}'`,
      status: formattedStatus,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};
