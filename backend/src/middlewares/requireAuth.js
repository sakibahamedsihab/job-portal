// backend/src/middlewares/requireAuth.js
//
// ── WHY WE DO NOT QUERY MONGODB DIRECTLY ────────────────────────────────────
//
// The previous version tried to validate sessions by:
//   1. Parsing the "better-auth.session_token" cookie manually
//   2. Looking up db.collection("session").findOne({ token })
//
// This broke for a subtle reason: Better Auth does NOT store the raw token
// from the cookie in the database. It hashes/transforms the token before
// storing it. So the cookie value ≠ the MongoDB "token" field, and
// findOne always returned null → "Invalid session token".
//
// ── THE CORRECT APPROACH ────────────────────────────────────────────────────
//
// Better Auth exposes a session-validation API at:
//   GET http://localhost:3000/api/auth/get-session
//
// If you pass the browser's Cookie header to this endpoint, Better Auth
// will validate the session internally (handling any hashing/transformation)
// and return the full user object.
//
// This is a server-to-server call (Express → Next.js), so:
//   - CORS and SameSite cookie rules do NOT apply (no browser involved)
//   - We just forward the raw Cookie header from the original request
//   - Better Auth reads "better-auth.session_token", looks up MongoDB itself,
//     and returns { session: {...}, user: {...} } or null
//
// ────────────────────────────────────────────────────────────────────────────

// The URL of the Next.js server where Better Auth lives
const NEXTJS_URL = process.env.NEXTJS_URL || "http://localhost:3000";

const requireAuth = async (req, res, next) => {
  try {
    // ── Step 1: Check that a cookie header exists at all ────────────────────
    // If there's no cookie, the request is definitely unauthenticated.
    // We don't even need to call Better Auth in this case.
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session cookie found.",
      });
    }

    // ── Step 2: Ask Better Auth to validate the session ─────────────────────
    // We forward the ENTIRE Cookie header (as received by Express) to Next.js.
    // Better Auth will extract "better-auth.session_token" from it,
    // validate it against MongoDB, and return the session + user data.
    const sessionResponse = await fetch(
      `${NEXTJS_URL}/api/auth/get-session`,
      {
        method: "GET",
        headers: {
          // Forward the browser's cookies so Better Auth can identify the user
          cookie: cookieHeader,
        },
      }
    );

    // ── Step 3: Parse the response ──────────────────────────────────────────
    const data = await sessionResponse.json();

    // Better Auth returns null (or { session: null, user: null }) when the
    // session token is invalid, expired, or not found
    if (!data || !data.session || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired session.",
      });
    }

    // ── Step 4: Attach the real user to req ─────────────────────────────────
    // From here, any controller can use req.user.id, req.user.role, etc.
    req.user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      // "role" is our custom additionalField defined in auth.js
      // Default to "seeker" if somehow missing (e.g. old accounts created
      // before we added the role field)
      role: data.user.role || "seeker",
    };

    console.log(`[Auth] Authenticated: ${req.user.email} (${req.user.role})`);
    next();

  } catch (error) {
    // This catches network errors (e.g. Next.js is not running on port 3000)
    console.error("[Auth] Failed to validate session with Better Auth:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "Authentication service unavailable. Make sure the Next.js server is running.",
    });
  }
};

module.exports = requireAuth;
