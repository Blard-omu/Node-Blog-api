Let's outline the requirements for our blog:

A user should be able to sign up and sign in to the blog app

A blog can be in two states: draft and published

A user should be able to get a list of published articles, whether logged in or not

A user should be able to get a published article, whether logged in or not

A logged in user should be able to create an article.

When an article is created, it should be in draft state.

The author of the article should be able to update the state of the article to published

The author of the article should be able to edit the article in draft or published state

The author of the article should be able to delete the article in draft or published state

The author of the article should be able to get a list of their articles. The endpoint should be paginated and filterable by state

Articles created should have title, cover image, description, tags, author, timestamp, state, read count, reading time and body.

The list of articles endpoint that can be accessed by both logged in and not logged in users should be paginated.

It should be searchable by author, title and tags.
It should also be orderable by read count, reading time and timestamp
When a single article is requested, the API should return the author's information with the blog, and the read count of the blog should increase by 1.
