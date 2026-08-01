// backend/src/controllers/savedJobControllers.js
//
// Controller for the Saved / Bookmarked Jobs feature.
// Allows Job Seekers to save jobs they are interested in, remove them,
// and view their list of saved jobs.

const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

// ─────────────────────────────────────────────────────────────────────────────
// toggleSaveJob
// Route: POST /api/saved-jobs/toggle (Seeker only)
// Body: { jobId }
//
// If the job is already saved by this seeker, it removes (unsaves) it.
// If the job is not saved, it saves it into the "saved_jobs" collection.
// ─────────────────────────────────────────────────────────────────────────────
const toggleSaveJob = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;
    const { jobId } = req.body;

    if (!jobId || !ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing job ID.",
      });
    }

    const jobObjectId = new ObjectId(jobId);

    // Check if this job is already saved by the user
    const existingBookmark = await db.collection("saved_jobs").findOne({
      seekerId,
      jobId: jobObjectId,
    });

    if (existingBookmark) {
      // Unsave (Remove bookmark)
      await db.collection("saved_jobs").deleteOne({
        seekerId,
        jobId: jobObjectId,
      });

      return res.status(200).json({
        success: true,
        saved: false,
        message: "Job removed from saved jobs.",
      });
    }

    // Verify job exists before saving
    const job = await db.collection("jobs").findOne({ _id: jobObjectId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Save job (Bookmark)
    const payload = {
      seekerId,
      jobId: jobObjectId,
      jobTitle: job.title,
      companyName: job.companyName || job.company || "Company",
      location: job.location || "Remote",
      salary: job.salary || "N/A",
      savedAt: new Date(),
    };

    await db.collection("saved_jobs").insertOne(payload);

    return res.status(201).json({
      success: true,
      saved: true,
      message: "Job saved to your bookmarks!",
    });
  } catch (error) {
    console.error("Error toggling saved job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getMySavedJobs
// Route: GET /api/saved-jobs/me (Seeker only)
//
// Fetches all saved jobs for the logged-in seeker, sorted newest first.
// ─────────────────────────────────────────────────────────────────────────────
const getMySavedJobs = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;

    const savedJobs = await db
      .collection("saved_jobs")
      .find({ seekerId })
      .sort({ savedAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// checkIsJobSaved
// Route: GET /api/saved-jobs/check/:jobId (Seeker only)
//
// Checks whether a specific job is already saved by the current user.
// ─────────────────────────────────────────────────────────────────────────────
const checkIsJobSaved = async (req, res) => {
  try {
    const db = getDB();
    const seekerId = req.user.id;
    const { jobId } = req.params;

    if (!jobId || !ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        isSaved: false,
        message: "Invalid job ID.",
      });
    }

    const bookmark = await db.collection("saved_jobs").findOne({
      seekerId,
      jobId: new ObjectId(jobId),
    });

    return res.status(200).json({
      success: true,
      isSaved: !!bookmark,
    });
  } catch (error) {
    console.error("Error checking saved job:", error);
    return res.status(500).json({
      success: false,
      isSaved: false,
    });
  }
};

module.exports = {
  toggleSaveJob,
  getMySavedJobs,
  checkIsJobSaved,
};
