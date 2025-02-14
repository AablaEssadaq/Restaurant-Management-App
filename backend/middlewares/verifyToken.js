import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export function verifyToken(req, res, next) {
  const token = req.cookies.accessToken; // ✅ Read token from HTTP-only cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {    
    if (err) {
      console.error("JWT Verification Error:", err.message);
      // 👇 If the error is "jwt expired", return 401 instead of 403
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Forbidden" });
    }

    const { role, email } = user;
    req.email = email;
    req.role = role;
    next();
  });
}


export default verifyToken;