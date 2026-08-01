import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { clientPromise } from "./mongodb";

// clientPromise theke database instance ta ber kore nicchi
const client = await clientPromise;
const db = client.db("job_portal");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      // "role" field — seeker or recruiter. input: true means
      // the client can pass it during signUp.email()
      role: {
        type: "string",
        required: true,
        defaultValue: "seeker",
        input: true,
      },
    },
  },
});
