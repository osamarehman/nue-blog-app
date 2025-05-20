---
include: [content, comments]
---

<script>
  import { model } from '../app/model/index.js'
  
  // This would be replaced by server-side rendering in a real app
  const slug = location.pathname.split('/').pop().replace(/\/$/, '')
  let post = null
  
  async function loadPost() {
    try {
      post = await model.getBlog(slug)
      document.title = `${post.title} - Nue Blog`
    } catch (error) {
      console.error('Error loading post:', error)
    }
  }
  
  loadPost()
</script>

<div if="!post" class="loading">Loading post...</div>

<article if="post" class="blog-post">
  <header class="post-header">
    <h1>{ post.title }</h1>
    <div class="post-meta">
      <span class="post-author">By { post.author.name }</span>
      <time class="post-date">{ formatDate(post.createdAt) }</time>
    </div>
    <img :src="post.featuredImage" alt="{ post.title }" class="post-image">
  </header>
  
  <div class="post-content">
    <markdown :content="post.content"/>
  </div>
  
  <footer class="post-footer">
    <comments-list :postId="post.id"/>
  </footer>
</article>

<script>
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>
