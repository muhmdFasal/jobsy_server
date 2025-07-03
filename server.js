const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts")); 
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/companies", require("./routes/Companyy"));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Jobsy backend API is running 🚀");
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


