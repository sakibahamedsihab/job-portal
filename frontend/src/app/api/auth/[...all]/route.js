import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth-কে Next.js এর বোধগম্য রাউটে কনভার্ট করা হচ্ছে
export const { GET, POST } = toNextJsHandler(auth);
