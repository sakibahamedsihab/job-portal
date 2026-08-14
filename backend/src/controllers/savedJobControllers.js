const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

function checkSeekerRole(req, res) {
  if (req.user.role !== "seeker") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only job seekers can save/unsave jobs.",
    });
  }
  return true;
}

const toggleSaveJob = async (req, res) => {
  try {
    if (!checkSeekerRole(req, res)) return;
    
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

    const existingBookmark = await db.collection("saved_jobs").findOne({
      seekerId,
      jobId: jobObjectId,
    });

    if (existingBookmark) {
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

    const job = await db.collection("jobs").findOne({ _id: jobObjectId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const payload = {
      seekerId,
      jobId: jobObjectId,
      jobTitle: job.title,
      companyName: job.companyName || job.company || "Company",
      location: job.location || "Remote",
      salary: job.salary || "N/A",
      jobType: job.jobType || "Full-Time",
      workplaceType: job.workplaceType || "Remote",
      experienceLevel: job.experienceLevel || "Mid-level",
      skills: job.skills || [],
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

const getMySavedJobs = async (req, res) => {
  try {
    if (!checkSeekerRole(req, res)) return;
    
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

const checkIsJobSaved = async (req, res) => {
  try {
    if (!checkSeekerRole(req, res)) return;
    
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
