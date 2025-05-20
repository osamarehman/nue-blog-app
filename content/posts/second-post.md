---
title: Building a Blog with Nue.js
description: A step-by-step guide to creating a blog with Nue.js
date: 2023-06-20
author: Jane Smith
thumb: /img/blog/blog-building.jpg
---

# Building a Blog with Nue.js

In this tutorial, we'll walk through the process of building a blog application using Nue.js. We'll cover everything from setting up the project to deploying it to production.

## Project Setup

First, let's create a new Nue.js project:

```bash
npm create nue@latest nue-blog
cd nue-blog
npm install
```

## Creating Content Collections

Nue.js makes it easy to manage blog posts using content collections. Here's how to set it up:

1. Create a `content/posts` directory in your project
2. Add your blog posts as Markdown files with front matter
3. Configure your site.yaml to use the posts collection

## Adding Interactive Components

Nue.js allows you to create interactive components using the `.dhtml` format. Here's an example of a comment form component:

```html
<div @name="comment-form">
  <form @submit.prevent="submitComment">
    <textarea :value="comment" @input="e => comment = e.target.value"></textarea>
    <button type="submit">Submit</button>
  </form>
  
  <script>
    constructor() {
      this.comment = ''
    }
    
    submitComment() {
      // Submit comment logic
      this.comment = ''
    }
  </script>
</div>
```

## Conclusion

Building a blog with Nue.js is straightforward and results in a fast, maintainable website. The framework's focus on web standards makes it a pleasure to work with.

