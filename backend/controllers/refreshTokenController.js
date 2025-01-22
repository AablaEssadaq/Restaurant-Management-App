import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/User.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Get the token from the cookie

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found." });
    }

    // Decode the refresh token to extract the email
    const decoded = jwt.decode(refreshToken);
    if (!decoded || !decoded.email) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Find the user using the email from the token
    const foundUser = await User.findOne({ email: decoded.email });

    if (!foundUser || !foundUser.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Compare the unhashed refresh token with the hashed one in the database
    const isMatch = await bcrypt.compare(refreshToken, foundUser.refreshToken);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Verify the refresh token with the secret key
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Token is invalid." });
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { email: decodedToken.email, role: decodedToken.role },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "15m" }
      );

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};
