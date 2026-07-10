import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // আমাদের Next.js সার্ভারের অ্যাড্রেস
});

// এখান থেকে আমরা আমাদের প্রয়োজনীয় ফাংশনগুলো এক্সপোর্ট করে নিচ্ছি
export const { signIn, signUp, signOut, useSession } = authClient;
