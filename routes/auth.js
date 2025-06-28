// const express = require("express");
// const router = express.Router();
// const { signup, login, getProfile,editProfile } = require("../controllers/authController");


// // const authMiddleware = require("../middleware/authMiddleware");
// // const authController = require("../controllers/authController");

// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/profile",  getProfile);
// router.put("/edit-profile",editProfile,authMiddleware, upload.single("image"));


// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   signup,
//   login,
//   getProfile,
//   editProfile,
// } = require("../controllers/authController");


// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/profile", authController, getProfile);
// router.put("/edit-profile", authController, editProfile);

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   signup,
//   login,
//   getProfile,
//   editProfile,
// } = require("../controllers/authController");

// // ✅ IMPORT THESE
// const authMiddleware = require("../middleware/authMiddleware");
// const upload = require("../middleware/Upload"); // If you're using multer for image uploads

// // ✅ ROUTES
// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/profile", authMiddleware, getProfile);
// router.put("/edit-profile", authMiddleware, upload.single("image"), editProfile);


// module.exports = router;
// routes/auth.js
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  editProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/Upload"); // multer config

// ✅ Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/edit-profile", authMiddleware, upload.single("image"), editProfile);

module.exports = router;


