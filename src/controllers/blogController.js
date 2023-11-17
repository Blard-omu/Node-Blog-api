import { cloudinary } from '../services/cloudinaryConfig.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';


 // Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imageFile = req.file;

    // Find the user by their username
    const user = await User.findOne({ username: author });

    if (!user) {
      return res.status(400).json({ error: 'You must log in to create a blog' });
    }

    // Upload the image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(imageFile.path);

    const blog = new Blog({
      title,
      content,
      author: user.username, 
      imageUrl: imageResult.secure_url,
    });

    // Save the new blog to the database
    await blog.save();

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a blog', errorMsg: error.message });
  }
};

// Get all blog posts based on the state (published or draft), with pagination
const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 6; 
  const { state } = req.query;
  
  const query = state ? { state } : {}; 

  try {
    const totalPosts = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(page * limit) 
      .limit(limit)
      .populate('author', 'username');

    res.json({
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: Math.floor(page / limit) + 1,
      blogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

// Get a specific blog post by ID
const getBlogById = async (req, res) => {
  try { 
    const { _id } = req.params;
    const blog = await Blog.findById(_id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the blog', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { _id } = req.params;
    const blogData = req.body;
    const imageFile = req.file;

    const existingBlog = await Blog.findById(_id);

    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the current user is the author of the blog
    if (req.user.username !== existingBlog.author) {
      return res.status(403).json({ error: 'You are not authorized' });
    }

    if (imageFile) {
      const imageResult = await cloudinary.uploader.upload(imageFile.path);
      existingBlog.imageUrl = imageResult.secure_url; 
    }

    // Update blog data
    if (blogData.title) {
      existingBlog.title = blogData.title;
    }
    if (blogData.content) {
      existingBlog.content = blogData.content;
    }
    if (blogData.state) {
      existingBlog.state = blogData.state;
    }
    
    const updatedBlog = await existingBlog.save();

    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update blog', errorMsg: error.message });
  }
};

// Delete a specific blog post
const deleteBlog = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(_id);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog', errorMsg: error.message });
  }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };