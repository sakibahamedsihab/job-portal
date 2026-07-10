const { getDB } = require("../config/db.js");

const createCompany = async (req, res) => {
  try {
    const { name, website, description } = req.body;

    const db = getDB();

    const payload = {
      name,
      website,
      description,
      createdAt: new Date(),
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

module.exports = {
  createCompany,
  getCompanies,
};
