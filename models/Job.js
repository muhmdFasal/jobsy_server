const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  salary: String,
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract"],
    default: "Full-time",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming TPO/company is a user with role "company"
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

jobSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

module.exports = mongoose.model("Job", jobSchema);
