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

export const users = {
  async getById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          role: true,
          createdAt: true,
          posts: {
            where: { published: true },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImage: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!user) throw new Error('User not found')

      return user
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to update a user')
      }

      // Check if user is updating their own profile or is an admin
      if (id !== currentUser.id && currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to update this user')
      }

      // Prepare update data
      const updateData = {}

      if (data.name) updateData.name = data.name
      if (data.bio) updateData.bio = data.bio
      if (data.avatar) updateData.avatar = data.avatar

      // Only admins can change roles
      if (data.role && currentUser.role === 'ADMIN') {
        updateData.role = data.role
      }

      // Handle password update
      if (data.password) {
        updateData.password = hashPassword(data.password)
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          role: true,
          createdAt: true
        }
      })

      return user
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error)
      throw error
    }
  },

  async getAll() {
    try {
      const currentUser = model.currentUser

      // Only admins can get all users
      if (!currentUser || currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to view all users')
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return users
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }
}
