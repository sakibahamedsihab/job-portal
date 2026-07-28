const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

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
      companyName: company.name,
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

const getJobs = async (req, res) => {
  try {
    const db = getDB();

    const jobs = await db.collection("jobs").find().toArray();

    res.status(200).json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID format" });
    }

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      job: job,
    });
  } catch (error) {
    console.error("Error fetching job by ID: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
};
