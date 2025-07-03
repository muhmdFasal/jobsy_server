
const Company = require("../models/Company");
const fs = require("fs");
const path = require("path");

// GET all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a company
exports.createCompany = async (req, res) => {
  try {
    const { name, website, description, location } = req.body;

    const newCompany = new Company({
      name,
      website,
      description,
      location,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newCompany.save();
    res.status(201).json({ message: "Company added successfully" });
  } catch (err) {
    console.error("Error adding company:", err);
    res.status(500).json({ message: "Error adding company" });
  }
};

// UPDATE a company
exports.updateCompany = async (req, res) => {
  try {
    const { name, website, description, location } = req.body;
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Handle logo update
    if (req.file) {
      // Delete old logo if exists
      if (company.logo) {
        const oldPath = path.join(__dirname, "..", company.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      company.logo = `/uploads/${req.file.filename}`;
    }

    // Update fields
    if (name) company.name = name;
    if (website) company.website = website;
    if (description) company.description = description;
    if (location) company.location = location;

    await company.save();
    res.status(200).json({ message: "Company updated successfully" });
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ message: "Error updating company" });
  }
};

// DELETE a company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.logo) {
      const filePath = path.join(__dirname, "..", company.logo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await company.deleteOne();
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ message: "Error deleting company" });
  }
};
