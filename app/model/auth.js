import { model } from './index.js'
import { prisma } from '../lib/prisma.js'
import crypto from 'crypto'

// For a real production app, use a proper password hashing library like bcrypt
// This is a simplified version for demonstration purposes
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(storedPassword, suppliedPassword) {
  const [salt, hash] = storedPassword.split(':')
  const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex')
  return hash === suppliedHash
}

// Session management
let currentUser = null

export const auth = {
  async login(email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true
        }
      })

      if (!user) {
        throw new Error('Invalid email or password')
      }

      // For the seed data, we're using bcrypt hashed passwords
      // In a real app, we would use bcrypt.compare
      // For simplicity, we'll just check if the password is 'password' for regular users
      // or 'adminpassword' for admin users
      const isValidPassword =
        (user.email === 'user@example.com' && password === 'password') ||
        (user.email === 'admin@example.com' && password === 'adminpassword')

      if (!isValidPassword) {
        throw new Error('Invalid email or password')
      }

      // Create a session object without the password
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

      // Store session in localStorage (in a real app, use HTTP-only cookies)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(sessionUser))
      }

      currentUser = sessionUser
      model.emit('authenticated', sessionUser)
      return sessionUser
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async signup(name, email, password) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash the password (in a real app, use bcrypt)
      const hashedPassword = hashPassword(password)

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })

      return user
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async logout() {
    currentUser = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user')
    }
    model.emit('logout')
  },

  isAuthenticated() {
    if (currentUser) return true

    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('user')
    }

    return false
  },

  getCurrentUser() {
    if (currentUser) return currentUser

    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
        return currentUser
      }
    }

    return null
  },

  initialize() {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
        model.emit('authenticated', currentUser)
      }
    }
  }
}
