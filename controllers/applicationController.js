const Application = require("../models/JobApplication");
const Job = require("../models/Job");

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const alreadyApplied = await Application.findOne({ job: jobId, user: userId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.expiresAt < new Date()) {
      return res.status(400).json({ message: "This job posting has expired" });
    }

    const application = new Application({
      job: jobId,
      user: userId,
      resume: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Error applying to job:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email mobile")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ user: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name",
        },
      })
      .sort({ appliedAt: -1 });

    // res.json(applications);
    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      statusCode: 200,
      count: applications.length,
      applications
    })
  } catch (err) {
    console.error("Error fetching user's applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};
