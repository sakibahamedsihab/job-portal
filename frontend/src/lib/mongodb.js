import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Please add your MONGO_URI to .env file");
}

const client = new MongoClient(uri);

// Database-e connect kore client promise-ta export korchi
export const clientPromise = client.connect();
