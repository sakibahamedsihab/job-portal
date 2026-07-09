const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    console.log("Attemping to connect...");
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    database = client.db("job_portal_db");
    return database;
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database not initialized! Call connectDB first.");
  }
  return database;
}

module.exports = { connectDB, getDB };
