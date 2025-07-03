const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  website: String,
  logo: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Company", companySchema);
