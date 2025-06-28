// // middleware/Upload.js
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure 'uploads' folder exists
// const uploadPath = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = Date.now() + ext;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

// Optional: Accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (.jpg, .jpeg, .png, .gif)"));
  }
};

const upload = multer({
  storage,
  fileFilter, // Optional safety
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;

