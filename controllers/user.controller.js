import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * Helper to normalize getDataUri return.
 * Accepts either a data-uri string or an object with `.content`.
 */
const normalizeDataUri = (fileUri) => {
  if (!fileUri) return null;
  if (typeof fileUri === "string") return fileUri;
  if (fileUri.content) return fileUri.content;
  return null;
};

/**
 * Return cookie options. Pass maxAge (ms). For clearing pass maxAge:0.
 */
const getCookieOptions = (maxAge = 30 * 24 * 60 * 60 * 1000) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge
});

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    // Check if user exists BEFORE uploading any file
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email.", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare profile object with defaults
    const profile = {
      profilePhoto: "",
    };

    // If file present, validate & upload
    const file = req.file;
    if (file) {
      // basic validations
      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

      if (file.size && file.size > maxSizeBytes) {
        return res.status(400).json({ message: "Uploaded file is too large (max 5MB).", success: false });
      }
      if (file.mimetype && !allowedImageTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Unsupported file type for profile photo.", success: false });
      }

      const fileUri = getDataUri(file);
      const dataToUpload = normalizeDataUri(fileUri);
      if (!dataToUpload) {
        return res.status(400).json({ message: "Invalid file data.", success: false });
      }

      const cloudResponse = await cloudinary.uploader.upload(dataToUpload);
      if (cloudResponse && cloudResponse.secure_url) {
        profile.profilePhoto = cloudResponse.secure_url;
      }
    }

    // Create user
    const created = await User.create({
      fullname,
      email,
      phoneNumber: String(phoneNumber),
      password: hashedPassword,
      role,
      profile,
    });

    const userResponse = {
      _id: created._id,
      fullname: created.fullname,
      email: created.email,
      phoneNumber: created.phoneNumber,
      role: created.role,
      profile: created.profile,
    };

    return res.status(201).json({ message: "Account created successfully.", success: true, user: userResponse });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password.", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect email or password.", success: false });
    }

    if (role !== user.role) {
      return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "30d" });

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    // Set httpOnly cookie usable by cross-origin front-end (Netlify)
    return res
      .status(200)
      .cookie("token", token, getCookieOptions()) // default 30 days
      .json({ message: `Welcome back ${user.fullname}`, user: userResponse, success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookie using same options (maxAge:0)
    return res
      .status(200)
      .cookie("token", "", getCookieOptions(0))
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    let cloudResponse = null;

    if (file) {
      // Allow images for profilePhoto or PDFs for resume depending on your front-end naming
      const maxSizeBytes = 8 * 1024 * 1024; // 8 MB limit for resume/profile
      if (file.size && file.size > maxSizeBytes) {
        return res.status(400).json({ message: "Uploaded file is too large (max 8MB).", success: false });
      }

      // You can allow additional mimetypes if you accept resumes (application/pdf)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (file.mimetype && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Unsupported file type.", success: false });
      }

      const fileUri = getDataUri(file);
      const dataToUpload = normalizeDataUri(fileUri);
      if (!dataToUpload) {
        return res.status(400).json({ message: "Invalid file data.", success: false });
      }

      cloudResponse = await cloudinary.uploader.upload(dataToUpload);
    }

    const userId = req.id; // from auth middleware
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    // Update fields if provided
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = String(phoneNumber);
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);

    // If a file was uploaded, decide where to store it:
    // - If it's an image, assume profilePhoto
    // - If it's a PDF, assume resume (adjust as per your frontend)
    if (cloudResponse) {
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        // treat as resume
        user.profile.resume = cloudResponse.secure_url;
        if (file.originalname) user.profile.resumeOriginalName = file.originalname;
      }
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({ message: "Profile updated successfully.", user: userResponse, success: true });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
