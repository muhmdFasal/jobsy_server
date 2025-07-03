// // middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attaches { id, role } to req.user
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err.message);
//     return res.status(401).json({ msg: "Token is not valid" });
//   }
// };

// module.exports = authMiddleware;
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Required to fetch user from DB

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id: user._id }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // ✅ Correct: attach the full user (including _id and role)
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
