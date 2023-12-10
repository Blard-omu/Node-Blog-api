import {
  createUser,
  loginUser,
  loginUserBody,
  createUserBody,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserBody,
  loginUserSocialBody
} from "./userDoc.js";
import {
  createBlog,
  createOrUpdateBlogBody,
  deleteBlog,
  getBlogs,
  getBlog,
  updateBlog,
  updateBlogBody,
} from "./blogDoc.js";

const apiDocumentation = {
  openapi: "3.0.1",
  info: {
    version: "1.3.0",
    title: "BLOGG REST API - Documentation",
    description:
      "Node express blogg api built by JULY CLASS. Contributors includes: David, Success, Tony, Richard, Treasure, Victor, Segun, Larry, John, Tobi, Saedat, Hussiena, Nonso. The BLOGG has the following key features: user can register and login, create blog post, edit blog post, delete blog post, user can also update profile, search for blog posts, blog posts pagination, and several other features. I'll like to specially acknowledge your efforts and dedication to the success of this project.",
    termsOfService: "https://mysite.com/terms",
    contributors:
      "David, Success, Tony, Richard, Treasure, Victor, Segun, Larry, John, Tobi, Saedat, Hussiena, Nonso",
    contact: {
      name: "July Class",
      email: "dev_mode@gmail.com",
      url: "https://github.com/blard-omu/node-blog-api",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "https://blogg-api-v1.onrender.com/",
      description: "Production Server",
    },
    {
      url: "http://localhost:8080/",
      description: "Dev Server",
    },
  ],
  tags: [
    {
      name: "Auth",
    },
    {
      name: "Users",
    },
    {
      name: "Blogs",
    },
  ],
  paths: {
    "/register": {
      post: createUser,
    },
    "/login": {
      post: loginUser,
    },
    "/verify-token": {
      post: loginUser,
    },
    "/auth/google": {
      get: loginUser,
    },
    "/auth/google/callback": {
      get: loginUser,
    },
    "/users": {
      get: getUsers,
    },
    "/user/_id": {
      delete: deleteUser,
      get: getUser,
      patch: updateUser,
    },
    "/blog/create": {
      post: createBlog,
    },
    "/blogs/all": {
      get: getBlogs,
    },
    "/blog/_id": {
      delete: deleteBlog,
      get: getBlog,
      patch: updateBlog,
    },
    "/blog/edit/_id": {
      patch: updateBlog,
    },
    "/blogs/search": {
      post: updateBlog,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      createUserBody,
      loginUserBody,
      updateUserBody,
      updateBlogBody,
      createOrUpdateBlogBody,
    },
  },
};

export { apiDocumentation };
