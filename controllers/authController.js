// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, mobile, role } = req.body;

//     // Check if user already exists
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       role,
//     });

//     // Generate token
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err.message);
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ msg: err.message });
//   }
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { name, mobile, gender, date_of_birth } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check if mobile is being changed and is unique
    if (mobile && mobile !== user.mobile) {
      const existingMobile = await User.findOne({ mobile, _id: { $ne: userId } });
      if (existingMobile) {
        return res.status(400).json({ msg: "Mobile number already in use" });
      }
    }

    // Handle image upload if present
    let imageUrl = user.image;
    if (req.file) {
      // Delete old image if exists
      if (user.image) {
        const oldImagePath = path.join(__dirname, "../uploads", path.basename(user.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;
    if (gender) updateData.gender = gender;
    if (date_of_birth) updateData.date_of_birth = new Date(date_of_birth);
    if (imageUrl !== user.image) updateData.image = imageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      msg: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        gender: updatedUser.gender,
        date_of_birth: updatedUser.date_of_birth,
        image: updatedUser.image,
      },
    });
  } catch (err) {
    console.error("Edit profile error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Current password and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};
