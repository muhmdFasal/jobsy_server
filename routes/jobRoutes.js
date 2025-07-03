const express = require("express");
const router = express.Router();
const auth = require("../middleware/AuthMiddleware");

const {
  createJob,
  getAllActiveJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.get("/active", getAllActiveJobs);

router.post("/", auth, createJob);

router.put("/:id", auth, updateJob);

router.delete("/:id", auth, deleteJob);

module.exports = router;
