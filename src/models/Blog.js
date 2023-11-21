// models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    state: {type: String, enum: ["draft", "published"], default: "draft"},
    category: {type: String, required: true},
    author: {type: String},
    imageUrl: {type: String},
    tags: {type: [String], default: [""]},
    read_time: {type: Number}
},
{timestamps: true})

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;


