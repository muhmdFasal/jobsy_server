const Job = require("../models/Job");

// POST: Create job
exports.createJob = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("User:", req.user);

    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Only company users can post jobs" });
    }

    const { title, description, location, salary, jobType, expiresAt } = req.body;

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      expiresAt,
      company: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: "Job created" });
  } catch (err) {
    console.error("Error creating job:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET all active jobs
exports.getAllActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ expiresAt: { $gte: new Date() } })
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//EDIT JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Fix: convert both ObjectIds to string before comparing
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = ["title", "description", "location", "salary", "jobType", "expiresAt"];
    updates.forEach(field => {
      if (req.body[field]) job[field] = req.body[field];
    });

    await job.save();
    res.json({ message: "Job updated" });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ✅ FIX: compare both as strings
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
};
