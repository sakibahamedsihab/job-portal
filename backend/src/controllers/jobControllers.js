const { getDB } = require("../config/db.js");

const createJob = async (req, res) => {
  try {
    const db = getDB();

    const { title, location, salary, description } = req.body;
    const recruiterId = req.user.id;

    const company = await db.collection("companies").findOne({ recruiterId });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: "You must create a company profile first.",
      });
    }

    const payload = {
      title,
      location,
      salary,
      description,
      recruiterId,
      companyId: company._id,
      createdAt: new Date(),
    };

    const result = await db.collection("jobs").insertOne(payload);

    res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      jobId: result.insertedId,
      payload: payload,
    });
  } catch (error) {
    console.error("Error creating job: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const db = getDB();
    const recruiterId = req.user.id;

    const jobs = await db.collection("jobs").find({ recruiterId }).toArray();

    res.status(200).json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createJob,
  getMyJobs,
};
