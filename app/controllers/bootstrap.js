import { model } from '../model/index.js'
import { auth } from '../model/auth.js'

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
  auth.initialize()
})

// Update navigation based on authentication status
model.on('authenticated', updateNavigation)
model.on('logout', updateNavigation)

function updateNavigation() {
  const isAuthenticated = model.authenticated
  
  if (isAuthenticated) {
    // Replace Login/Signup links with Profile/Logout
    const headerNav = document.querySelector('header nav')
    if (headerNav) {
      const loginLink = headerNav.querySelector('a[href="/auth/login/"]')
      const signupLink = headerNav.querySelector('a[href="/auth/signup/"]')
      
      if (loginLink) {
        loginLink.textContent = 'Profile'
        loginLink.href = '/auth/profile/'
      }
      
      if (signupLink) {
        signupLink.textContent = 'New Post'
        signupLink.href = '/blog/new/'
      }
    }
  }
}

// Call once on initial load
updateNavigation()
