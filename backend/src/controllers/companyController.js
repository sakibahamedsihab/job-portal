const { getDB } = require("../config/db.js");

function checkRecruiterRole(req, res) {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only recruiters can create company profiles.",
    });
  }
  return true;
}

const createCompany = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;
    
    const { name, website, description, logo } = req.body;

    const db = getDB();

    const recruiterId = req.user.id;

    const existCompany = await db
      .collection("companies")
      .findOne({ recruiterId });

    if (existCompany) {
      return res.status(400).json({
        success: false,
        message: "You already have a registered company. You cannot create another one.",
      });
    }

    const payload = {
      name: name?.trim(),
      website: website?.trim(),
      description: description?.trim(),
      logo: logo || "",
      recruiterId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("companies").insertOne(payload);

    res.status(200).json({
      success: true,
      message: "Company Profile Created successfully.",
      insertedId: result.insertedId,
      payload,
    });
  } catch (error) {
    console.error("Error creating company: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateCompany = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;

    const { name, website, description, logo } = req.body;
    const db = getDB();
    const recruiterId = req.user.id;

    const company = await db.collection("companies").findOne({ recruiterId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found. Please create one first.",
      });
    }

    const updateFields = {
      ...(name && { name: name.trim() }),
      ...(website && { website: website.trim() }),
      ...(description && { description: description.trim() }),
      ...(logo !== undefined && { logo: logo || "" }),
      updatedAt: new Date(),
    };

    await db.collection("companies").updateOne(
      { _id: company._id },
      { $set: updateFields }
    );

    // If company name or logo changed, sync with active posted jobs
    if (name || logo !== undefined) {
      await db.collection("jobs").updateMany(
        { companyId: company._id },
        {
          $set: {
            ...(name && { companyName: name.trim() }),
            ...(logo !== undefined && { companyLogo: logo || "" }),
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully.",
      company: { ...company, ...updateFields },
    });
  } catch (error) {
    console.error("Error updating company: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCompanies = async (req, res) => {
  try {
    const db = getDB();
    const companies = await db.collection("companies").find({}).toArray();

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error Fetching Companies: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

const getMyCompnay = async (req, res) => {
  try {
    if (!checkRecruiterRole(req, res)) return;
    
    const db = getDB();

    const recruiterId = req.user.id;

    const company = await db.collection("companies").findOne({ recruiterId });

    res.status(200).json({ success: true, company: company || null });
  } catch (error) {
    console.error("Error fetching my company: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createCompany,
  updateCompany,
  getCompanies,
  getMyCompnay,
};
