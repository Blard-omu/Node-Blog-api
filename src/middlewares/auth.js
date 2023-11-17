import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

dotenv.config();

const requireSignedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Set the authenticated user in the request object
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

//
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // If the user is found, attach it to the request object
    req.user = user;

    user.password = undefined;

    // Respond with the user data
    res.json({ message: "User verified", user });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const requireBlogAuthor = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const blog = await Blog.findById(_id);
    
    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the current user is the author of the blog
    if (req.user.username !== blog.author) {
      return res.status(403).json({ error: 'You are not authorized to update this blog' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to check blog author', errorMsg: error.message });
  }
};

export { requireSignedIn, verifyToken, requireBlogAuthor };
