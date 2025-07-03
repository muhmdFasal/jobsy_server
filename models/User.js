const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin","company"], default: "user" },
    gender: {
      type: String,
    },
    date_of_birth: {
      type: Date,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
