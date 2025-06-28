const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Add your frontend URLs
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts")); 

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Jobsy backend API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

