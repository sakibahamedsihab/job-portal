import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    // Manually declare the extra fields we added in auth.js
    // so the client knows about them (avoids importing server-side auth.js into the browser)
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: true,
          defaultValue: "seeker",
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
