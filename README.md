## Node Blog API Documentation

### Step 1: Clone the Repository

1. Clone the GitHub repository to your local machine using Git:

   ```bash
   git clone https://github.com/Blard-omu/Node-Blog-api.git
   ```

2. Navigate to the project folder:

   ```bash
   cd Node-Blog-api
   ```

3. Start the server:
   ```
   npm start
   ```

---
## Alternatively,

### Step 2: Initialization a new prroject

1. Create a new Node.js project and initialize it with npm:

   ```bash
   npm init -y
   ```

2. Install required dependencies (express, mongoose, dotenv, cloudinary, multer, express-validator, etc):

   ```bash
   npm install express mongoose dotenv cloudinary multer express-validator
   ```

### Step 3: Folder Structure

Create a folder structure for your project:

```
Node-Blog-api/
  ├── controllers/
  │   ├── authController.js
  │   ├── userController.js
  │   ├── blogController.js
  ├── models/
  │   ├── User.js
  │   ├── Blog.js
  ├── services/
  │   ├── cloudinaryConfig.js
  │   ├── multer.js
  ├── routes/
  │   ├── authRoutes.js
  │   ├── userRoutes.js
  │   ├── blogRoutes.js
  ├── uploads/    # this folder is optional since we'll be saving our uploads to cloudinary
  index.js
  .env
```

### Step 4: Create Express Server

In your `index.js` file, set up the Express server:

```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogRouter from "./src/routes/blogRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Define your routes (auth, users, blog) and import them
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/blog", require("./routes/blogRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Step 5: Connect to Database

Define your database connection URL and environment variables in the `.env` file:

```
MONGODB_CONNECTION_URL=mongodb+srv://your-db-connection-url
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

### Step 6: Define Schemas

#### User Schema (`User.js`)

```javascript
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

// Define a method to check the user's password
userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export { User };
```

#### Blog Schema (`Blog.js`)

```javascript
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String }, // For storing Cloudinary image URLs
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export { Blog };

```


### Step 7: Implement Controllers

#### User Controller (`userController.js`)
```javascript
// const User = require('../models/User');
import User from '../models/User';

const register = async (req, res) => {
  try{
    // define the body fields
    const { username, email, password } = req.body;

    // validations for all fields
    if(!username.trim()){
      return res.json({ error: "username must not be empty!"})
    }
    if(!email){
      return res.json({ error: "Email must not be empty!"})
    }
    if(!password || password.length < 6){
      return res.json({ error: "password must be at least 6 characters long!"})
    }

    // check if the user already exist
    const userExist = await User.findOne({ email });

    if(userExist){
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Register a new user
    const user = new User({username, email, password: hashedPassword});

    // Save the user in db
    await user.save();

    // remove pasword from res body
    user.password = undefined;

    // create token for new user
    const secret =  process.env.JWT_SECRET
    const token = jwt.sign({userId: user._id}, secret, {expiresIn: "7d"})
    console.log("JWT_SECRET: ", secret);
  
    // send a notification
    res.status(201).json({message: 'User registered successfully', user, token});

  }catch(err){
    res.status(500).json({message: "User registration failed", error: err.message});
  }
};

export = {
  registerUser,
  // Add other controller functions
};

```



#### Blog Controller (`blogController.js`)

```JavaScript
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
      return res.status(400).json({ message: 'You must log in to create a blog' });
    }

    // Upload the image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(imageFile.path);

    const blog = new Blog({
      title,
      content,
      author: user.username,
      image: imageResult.secure_url,
    });

    // Save the new blog to the database
    await blog.save();

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create a blog', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedBlogData = req.body;
    const imageFile = req.file;

    const existingBlog = await Blog.findById(_id);

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (imageFile) {
      const imageResult = await cloudinary.uploader.upload(imageFile.path);
      existingBlog.imageUrl = imageResult.secure_url;
    }

    existingBlog.title = updatedBlogData.title || existingBlog.title;
    existingBlog.content = updatedBlogData.content || existingBlog.content;

    const updatedBlog = await existingBlog.save();

    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
};




export {
  createBlog,
  updateBlog,
  // Add other blog controller functions here ...
};

```


### Step 8: Handling Image Upload with Cloudinary and Multer

In your `blogController.js`, use the `cloudinary` and `multer` packages to handle image uploads when creating or updating a blog post. the complete code in the src folder.

### Step 9: Testing with Postman

Test your API endpoints using Postman or any API testing tool. Ensure that you can create, read, update, and delete blog posts, as well as manage user accounts.

### Step 10: Hosting on Render

To host your API on Render, create a new Render service, connect your project's GitHub repository, and set up your deployment configuration. Ensure that environment variables (e.g., Cloudinary credentials) are securely stored on Render.

By following these steps and using the provided code examples in my <a href="https://github.com/Blard-omu/Node-Blog-api.git">repo</a>, you can effectively set up and deploy your Node.js blog application.

---

I am <a href="https://github.com/Blard-omu">BLARD</a>, a Fullstack Developer and Instructor at <a href="https://www.techstudioacademy.com/">Techstudioacademy</a>
