const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

function checkSeekerRole(req, res) {
  if (req.user.role !== "seeker") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only job seekers can apply to jobs.",
    });
  }
  return true;
}

function checkRecruiterRole(req, res) {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only recruiters can access this resource.",
    });
  }
  return true;
}

const applyToJob = async (req, res) => {
  try {
    if (!checkSeekerRole(req, res)) return;
    
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

    let seeker = null;
    if (ObjectId.isValid(seekerId)) {
      seeker = await db.collection("user").findOne({ _id: new ObjectId(seekerId) });
    }

    const applicationPayload = {
      jobId: new ObjectId(jobId),
      seekerId,
      status: "pending",
      jobTitle: job.title,
      companyName: job.companyName || job.company || "Company",
      seekerName: seeker?.name || req.user.name || "Unknown Candidate",
      seekerEmail: seeker?.email || req.user.email || "Unknown Email",
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

const getMyApplications = async (req, res) => {
  try {
    if (!checkSeekerRole(req, res)) return;
    
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

const getJobApplicants = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;
    
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

const updateApplicationStatus = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;
    
    const db = getDB();
    const recruiterId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED_STATUSES = ["pending", "reviewing", "interview", "accepted", "rejected"];

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

    const application = await db.collection("applications").findOne({
      _id: new ObjectId(id),
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

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
