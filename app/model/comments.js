import { model } from './index.js'
import { prisma } from '../lib/prisma.js'

export const comments = {
  async getByPost(postId) {
    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return comments
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error)
      throw error
    }
  },

  async create(data) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to comment')
      }

      const comment = await prisma.comment.create({
        data: {
          content: data.content,
          postId: data.postId,
          authorId: currentUser.id
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })

      return comment
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to delete a comment')
      }

      // Get the existing comment
      const existingComment = await prisma.comment.findUnique({
        where: { id }
      })

      if (!existingComment) {
        throw new Error('Comment not found')
      }

      // Check if user is author or admin
      if (existingComment.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to delete this comment')
      }

      // Delete the comment
      await prisma.comment.delete({
        where: { id }
      })

      return { success: true }
    } catch (error) {
      console.error(`Error deleting comment with id ${id}:`, error)
      throw error
    }
  }
}
