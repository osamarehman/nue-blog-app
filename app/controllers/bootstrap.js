import { model } from '../model/index.js'
import { auth } from '../model/auth.js'
import Navi from '../../@components/navi.html';

// Register the navi component globally
customElements.define('navi', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = Navi;
  }
});

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
  auth.initialize()

  // Set current page in navigation
  setCurrentPage()
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

// Set current page in navigation
function setCurrentPage() {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll('header nav a')

  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPath ||
        (href !== '/' && currentPath.startsWith(href)) ||
        (href === '/' && currentPath === '/')) {
      link.setAttribute('aria-current', 'page')
    }
  })
}

// Call once on initial load
updateNavigation()

const navigation = {
  header: [
    { title: 'Home', url: '/' },
    { title: 'Blog', url: '/blog/' },
    { title: 'About', url: '/about/' },
    { title: 'Contact', url: '/contact/' }
  ],
  footer: [
    { title: 'Privacy Policy', url: '/privacy/' },
    { title: 'Terms of Service', url: '/terms/' },
    { title: 'Support', url: '/support/' }
  ]
};

// Make navigation globally accessible
window.navigation = navigation;
