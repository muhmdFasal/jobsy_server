// const express = require("express");
// const router = express.Router();

// const {
//   applyToJob,
//   getApplicantsForJob,
// } = require("../controllers/applicationController");
// const authMiddleware = require("../middleware/AuthMiddleware");

// // Apply to a job (user)
// router.post("/apply/:id", authMiddleware, applyToJob);

// // Get applicants for a job (company)
// router.get("/job/:id/applicants", authMiddleware, getApplicantsForJob);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getApplicantsForJob,
  getMyApplications,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/AuthMiddleware");
const { uploadResume } = require("../middleware/Upload");

// Apply to job (resume required)
router.post("/apply/:id", authMiddleware, uploadResume.single("resume"), applyToJob);

// Get applicants (company only)
router.get("/job/:id/applicants", authMiddleware, getApplicantsForJob);

// Get my applications
router.get("/my-applications", authMiddleware, getMyApplications);

module.exports = router;
