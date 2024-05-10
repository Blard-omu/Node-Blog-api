import { cloudinary } from '../services/cloudinaryConfig.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { calculateReadingTime } from '../services/helpers.js';


const createBlog = async (req, res) => {
  try {
    const { title, content, author, category, tags } = req.body;
    const imageFile = req.file;

    // Find the user by their username
    const user = await User.findOne({ username: author });

    if (!user) {
      return res.status(400).json({ error: 'You must log in to create a blog' });
    }

    let imageUrl = "";
    try {
      if (imageFile) {
        const imageResult = await cloudinary.uploader.upload(imageFile.path);
        imageUrl = imageResult.secure_url;
      }
      console.log("Image Upload Successful");
    } catch (error) {
      console.log("Error uploading image");
      res.status(500).json({ error: 'Failed to Upload image', errorMsg: error.message });
    }

    // Upload the image to Cloudinary
    // const imageResult = await cloudinary.uploader.upload(imageFile.path);

    // Calculate read time using the provided function
    const readTime = calculateReadingTime(content);

    const blogTags = typeof tags === 'string' ? tags.split(",") : tags;


    const blog = new Blog({
      title,
      content,
      author: user.username, 
      imageUrl: imageUrl,
      read_time: readTime,
      tags: blogTags,
      category
    });

    // Save the new blog to the database
    await blog.save();

    res.status(201).json({success: true, message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a blog', errorMsg: error.message });
  }
};


// Get all blog posts based on the state (published or draft), with pagination
const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 6; 
  const { state, author } = req.query;
  
  const query = state ? { state } : {}; 

  if (author) {
    query.author = author;
  } 

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

// Get a blog post by ID
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


const searchBlog = async (req, res) => {
  const { term } = req.query;
  try {
    const searchRegex = new RegExp(term, 'i');

    const blogs = await Blog.find({
      $and: [
        { state: 'published' }, // Only published blog can be searchable
        {
          $or: [
            { author: searchRegex },
            { title: searchRegex },
          ],
        },
      ],
    });

    res.json({ blogs });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ error: 'Failed to search blogs', errorMsg: error.message });
  }
};


const editState = async (req, res) => {
  try {
    const { _id } = req.params;
    const { state } = req.body;
    console.log('Received body:', req.body);

    if (!['draft', 'published'].includes(state)) {
      return res.status(400).json({ error: 'Invalid state value' });
    }
    const blog = await Blog.findById( _id );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.state = state

    await blog.save();

    res.status(200).json({ message: 'Blog state updated successfully', blog });
  } catch (error) {
    console.error('Error updating blog state:', error);
    res.status(500).json({ error: 'Failed to update blog state', errorMsg: error.message });
  }
};


export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, searchBlog, editState };