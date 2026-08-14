const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

const getAdminStats = async (req, res) => {
  try {
    const db = getDB();

    const [totalUsers, totalJobs, totalApplications, totalCompanies] = await Promise.all([
      db.collection("user").countDocuments(),
      db.collection("jobs").countDocuments(),
      db.collection("applications").countDocuments(),
      db.collection("companies").countDocuments(),
    ]);

    const seekerCount = await db.collection("user").countDocuments({ role: "seeker" });
    const recruiterCount = await db.collection("user").countDocuments({ role: "recruiter" });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        seekerCount,
        recruiterCount,
        totalJobs,
        totalApplications,
        totalCompanies,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = await db
      .collection("user")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAdminJobs = async (req, res) => {
  try {
    const db = getDB();
    const jobs = await db
      .collection("jobs")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteJobAdmin = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID." });
    }

    const jobObjectId = new ObjectId(id);

    const result = await db.collection("jobs").deleteOne({ _id: jobObjectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    await db.collection("applications").deleteMany({ jobId: jobObjectId });

    return res.status(200).json({
      success: true,
      message: "Job post and associated applications removed by Admin.",
    });
  } catch (error) {
    console.error("Error deleting job by admin:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUserAdmin = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const userObjectId = new ObjectId(id);
    const user = await db.collection("user").findOne({ _id: userObjectId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Delete the user record
    await db.collection("user").deleteOne({ _id: userObjectId });

    // Cascade cleanups
    await db.collection("session").deleteMany({ userId: userObjectId });
    await db.collection("account").deleteMany({ userId: userObjectId });
    await db.collection("applications").deleteMany({ seekerId: id });
    await db.collection("saved_jobs").deleteMany({ seekerId: id });

    // If recruiter, remove company and posted jobs
    const recruiterJobs = await db.collection("jobs").find({ recruiterId: id }).toArray();
    const jobIds = recruiterJobs.map((j) => j._id);
    if (jobIds.length > 0) {
      await db.collection("applications").deleteMany({ jobId: { $in: jobIds } });
      await db.collection("saved_jobs").deleteMany({ jobId: { $in: jobIds } });
      await db.collection("jobs").deleteMany({ recruiterId: id });
    }
    await db.collection("companies").deleteMany({ recruiterId: id });

    return res.status(200).json({
      success: true,
      message: "User account and associated data removed by Admin.",
    });
  } catch (error) {
    console.error("Error deleting user by admin:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  getAdminJobs,
  deleteJobAdmin,
  deleteUserAdmin,
};