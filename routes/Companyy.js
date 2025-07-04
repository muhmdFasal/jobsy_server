
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/isAdmin");

const {
  getAllCompanies,
  createCompany,
  deleteCompany,
  updateCompany, 
} = require("../controllers/companyController");
const { upload } = require("../middleware/Upload");

// GET all companies (admin only)
router.get("/", authMiddleware, adminMiddleware, getAllCompanies);

// POST new company with logo
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("logo"),
  createCompany
);

// PUT update company with optional logo update
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("logo"),
  updateCompany
);

// DELETE company
router.delete("/:id", authMiddleware, adminMiddleware, deleteCompany);

module.exports = router;
