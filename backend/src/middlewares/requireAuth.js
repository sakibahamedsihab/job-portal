const { getDB } = require("../config/db.js");
const { ObjectId } = require("mongodb");

function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      const decoded = decodeURIComponent(value);
      return decoded.split(".")[0];
    }
  }
  return null;
}

const requireAuth = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;

    const sessionToken =
      parseCookie(cookieHeader, "better-auth.session_token") ||
      parseCookie(cookieHeader, "session_token") ||
      parseCookie(cookieHeader, "auth_session");

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session token found.",
      });
    }

    const db = getDB();

    const session = await db.collection("session").findOne({
      token: sessionToken,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session.",
      });
    }

    if (new Date(session.expiresAt) < new Date()) {
      await db.collection("session").deleteOne({ _id: session._id });
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Session expired.",
      });
    }

    const user = await db.collection("user").findOne({
      _id: session.userId,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found.",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "seeker",
    };

    console.log(`[Auth] Authenticated: ${req.user.email} (${req.user.role})`);
    next();
  } catch (error) {
    console.error("[Auth] Failed to validate session:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication service error.",
    });
  }
};

module.exports = requireAuth;