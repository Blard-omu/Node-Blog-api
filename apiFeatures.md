
# FEATURES OF BLOGG API

## User Authentication:

- Users can register and log in to the application.
Support for Google OAuth authentication. (Not fully functional yet)


## Blog Management:

- Users can create new blog posts with a title, content, image, category, and tags.
The application calculates and stores the read time of each blog post.
Blogs can be categorized as "draft" or "published."


## Blog Retrieval and Filtering:

- Retrieve a list of all blog posts with pagination.
Filter blogs based on their state (published or draft).
Filter blogs by author.


## Blog Updates and Deletion:

- Users can update the content, title, state, and image of their own blog posts.
Users can delete their own blog posts.



## Search Functionality:

- Users can search for blogs based on the author's username or blog title.


## Rate Limiting:

- Implement rate limiting to control the number of requests from a single IP address.


## Swagger Documentation:

- Integration with Swagger UI for API documentation, providing a user-friendly interface to understand and test the available API endpoints.


## Error Handling:

- Comprehensive error handling, providing appropriate error messages and status codes in case of issues.


## State Editing:

- Users can edit the state of a blog post (e.g. change from draft to published or vice versa).


## Security:

Implementation of rate limiting for API requests.
Authentication middleware to ensure that only authorized users can perform certain actions (e.g., updating or deleting blogs).


## Dependencies:

The application uses various libraries and services, such as Cloudinary for image uploads, passport for authentication, mongoose as ODM, and several other to ensure the application works as expected and to fast track development.
