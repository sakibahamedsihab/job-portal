const { getDB } = require("../config/db.js");

/**
 * Parse a raw Cookie header string into a key-value object.
 * e.g. "a=1; b=2" -> { a: "1", b: "2" }
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((part) => {
    const [name, ...rest] = part.trim().split("=");
    if (name) cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
  });
  return cookies;
}

/**
 * requireAuth — validates the Better Auth session token from the browser cookie,
 * looks up the session + user in MongoDB, and attaches req.user.
 *
 * Better Auth stores sessions in the "session" collection (singular).
 * The browser sends the token in the "better-auth.session_token" cookie.
 */
const requireAuth = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies["better-auth.session_token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session token found.",
      });
    }

    const db = getDB();

    // 1. Find the session by token
    const session = await db.collection("session").findOne({ token });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session token.",
      });
    }

    // 2. Check the session has not expired
    if (new Date() > new Date(session.expiresAt)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Session has expired. Please log in again.",
      });
    }

    // 3. Find the user linked to this session
    const user = await db.collection("user").findOne({ id: session.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found.",
      });
    }

    // 4. Attach the real user to the request
    req.user = {
      id: session.userId,       // Better Auth stores userId as a string
      email: user.email,
      name: user.name,
      role: user.role || "seeker",
    };

    console.log(`[Auth] Authenticated: ${req.user.email} (${req.user.role})`);
    next();
  } catch (error) {
    console.error("[Auth] Error in requireAuth middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

module.exports = requireAuth;
