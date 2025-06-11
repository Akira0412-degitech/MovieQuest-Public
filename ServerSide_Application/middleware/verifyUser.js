// middleware/verifyUser.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyUser(req, res, next) {
    
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: true, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 必要なら req.user にユーザー情報追加
    next();
  } catch (err) {
    return res.status(403).json({ error: true, message: "Invalid token" });
  }
}

module.exports = verifyUser;
