// const express = require("express");
// const router = express.Router();

// const {
//   signup,
//   login,
//   getProfile,
//   editProfile,
//   getAllUsers,
//   getOwnProfile,
// } = require("../controllers/authController");
// const adminMiddleware = require("../middleware/isAdmin");
// const upload = require("../middleware/Upload"); 
// const authMiddleware = require("../middleware/AuthMiddleware");


// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/profile", authMiddleware, getProfile);
// router.put("/edit-profile", authMiddleware, upload.single("image"), editProfile);
// router.get("/", authMiddleware,adminMiddleware, getAllUsers);
// router.get("/me", authMiddleware,adminMiddleware, getOwnProfile);

           


// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  editProfile,
  getAllUsers,
  getOwnProfile,
  deleteUser,
} = require("../controllers/authController");

const adminMiddleware = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/AuthMiddleware");
const { upload } = require("../middleware/Upload");

// Auth & Profile Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/edit-profile", authMiddleware, upload.single("image"), editProfile);

// User Management Routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/me", authMiddleware, getOwnProfile); 
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;


