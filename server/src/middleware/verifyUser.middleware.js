import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  try {

    // Token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach user id to request
    req.userId = decoded.userId;

    next();

  } catch (error) {

    console.log("Verify User Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};