import { auth } from './auth.js'
import { blogs } from './blogs.js'
import { comments } from './comments.js'
import { users } from './users.js'
import { contact } from './contact.js'

const handlers = []

export const model = {
  // Authentication
  async login(email, password) {
    return auth.login(email, password)
  },

  async signup(name, email, password) {
    return auth.signup(name, email, password)
  },

  async logout() {
    return auth.logout()
  },

  get authenticated() {
    return auth.isAuthenticated()
  },

  get currentUser() {
    return auth.getCurrentUser()
  },

  // Blogs
  async getBlogs(params = {}) {
    return blogs.getAll(params)
  },

  async getBlog(slug) {
    return blogs.getBySlug(slug)
  },

  async createBlog(data) {
    return blogs.create(data)
  },

  async updateBlog(slug, data) {
    return blogs.update(slug, data)
  },

  async deleteBlog(slug) {
    return blogs.delete(slug)
  },

  // Comments
  async getComments(postId) {
    return comments.getByPost(postId)
  },

  async createComment(data) {
    return comments.create(data)
  },

  async deleteComment(id) {
    return comments.delete(id)
  },

  // Users
  async getUser(id) {
    return users.getById(id)
  },

  async updateUser(id, data) {
    return users.update(id, data)
  },

  // Contact
  async submitContactForm(name, email, message) {
    return contact.submit({ name, email, message })
  },

  // Event handling
  on(event, fn) {
    handlers.push({ event, fn })
    return () => {
      const index = handlers.findIndex(h => h.event === event && h.fn === fn)
      if (index !== -1) handlers.splice(index, 1)
    }
  },

  emit(event, data) {
    handlers.forEach(h => {
      if (h.event === event) h.fn(data)
    })
  }
}
