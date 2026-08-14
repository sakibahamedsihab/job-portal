const { connectDB } = require("../config/db.js");

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("Usage: node src/scripts/createAdmin.js <user-email>");
    process.exit(1);
  }

  try {
    const db = await connectDB();
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      console.error(`User with email "${email}" not found in database.`);
      console.log("Please register the account first via the signup page, then run this script.");
      process.exit(1);
    }

    await db.collection("user").updateOne(
      { email },
      { $set: { role: "admin", updatedAt: new Date() } }
    );

    console.log(`Successfully promoted "${email}" (${user.name}) to ADMIN role!`);
    process.exit(0);
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    process.exit(1);
  }
}

main();
