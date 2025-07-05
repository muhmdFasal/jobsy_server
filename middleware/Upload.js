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

// Resume storage
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = "resume_" + Date.now() + ext;
    cb(null, uniqueName);
  },
});

// Resume file filter (validate by MIME type, not extension only)
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .doc, .docx files allowed!"));
  }
};

// Resume uploader
const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});


module.exports = {
  upload, // for image uploads
  uploadResume, // for resume uploads
};
