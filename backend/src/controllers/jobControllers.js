const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

function checkRecruiterRole(req, res) {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only recruiters can post jobs.",
    });
  }
  return true;
}

function parseList(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    // If contains newlines, split by line, otherwise by commas
    const delimiter = input.includes("\n") ? "\n" : ",";
    return input
      .split(delimiter)
      .map((item) => item.trim().replace(/^[-*•\d.]\s*/, "")) // remove bullet markers if any
      .filter(Boolean);
  }
  return [];
}

const createJob = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;
    
    const db = getDB();

    const {
      title,
      category,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      salary,
      description,
      skills,
      responsibilities,
      requirements,
      benefits,
      deadline,
    } = req.body;

    const recruiterId = req.user.id;

    if (!title || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, location, salary, and description are required.",
      });
    }

    const company = await db.collection("companies").findOne({ recruiterId });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: "You must create a company profile first.",
      });
    }

    const payload = {
      title: title.trim(),
      category: category ? category.trim() : "Engineering",
      jobType: jobType ? jobType.trim() : "Full-Time",
      workplaceType: workplaceType ? workplaceType.trim() : "Remote",
      experienceLevel: experienceLevel ? experienceLevel.trim() : "Mid-level",
      location: location.trim(),
      salary: salary.trim(),
      description: description.trim(),
      skills: parseList(skills),
      responsibilities: parseList(responsibilities),
      requirements: parseList(requirements),
      benefits: parseList(benefits),
      deadline: deadline || null,
      recruiterId,
      companyId: company._id,
      companyName: company.name,
      companyLogo: company.logo || "",
      createdAt: new Date(),
      updatedAt: new Date(),
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
    if (!checkRecruiterRole(req, res)) return;
    
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

const updateJob = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;

    const db = getDB();
    const { id } = req.params;
    const recruiterId = req.user.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID format" });
    }

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only edit jobs you posted.",
      });
    }

    const {
      title,
      category,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      salary,
      description,
      skills,
      responsibilities,
      requirements,
      benefits,
      deadline,
    } = req.body;

    const updateFields = {
      ...(title && { title: title.trim() }),
      ...(category && { category: category.trim() }),
      ...(jobType && { jobType: jobType.trim() }),
      ...(workplaceType && { workplaceType: workplaceType.trim() }),
      ...(experienceLevel && { experienceLevel: experienceLevel.trim() }),
      ...(location && { location: location.trim() }),
      ...(salary && { salary: salary.trim() }),
      ...(description && { description: description.trim() }),
      ...(skills !== undefined && { skills: parseList(skills) }),
      ...(responsibilities !== undefined && { responsibilities: parseList(responsibilities) }),
      ...(requirements !== undefined && { requirements: parseList(requirements) }),
      ...(benefits !== undefined && { benefits: parseList(benefits) }),
      ...(deadline !== undefined && { deadline: deadline || null }),
      updatedAt: new Date(),
    };

    await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
    });
  } catch (error) {
    console.error("Error updating job: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;

    const db = getDB();
    const { id } = req.params;
    const recruiterId = req.user.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID format" });
    }

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only delete jobs you posted.",
      });
    }

    await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });
    await db.collection("applications").deleteMany({ jobId: new ObjectId(id) });
    await db.collection("saved_jobs").deleteMany({ jobId: id });

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting job: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
