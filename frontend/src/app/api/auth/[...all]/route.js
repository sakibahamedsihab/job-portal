import { toNextJsHandler } from "better-auth/next-js";

// Better Auth-কে Next.js এর বোধগম্য রাউটে কনভার্ট করা হচ্ছে
export const { GET, POST } = toNextJsHandler(auth);
