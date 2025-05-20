import { model } from './index.js'
import { prisma } from '../lib/prisma.js'

export const blogs = {
  async getAll(params = {}) {
    try {
      const { published = true, limit, offset, authorId, tagName } = params

      // Build the where clause
      const where = {}

      // Filter by published status
      if (published !== undefined) {
        where.published = published
      }

      // Filter by author
      if (authorId) {
        where.authorId = authorId
      }

      // Filter by tag
      if (tagName) {
        where.tags = {
          some: {
            name: tagName
          }
        }
      }

      // Query the database
      const posts = await prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          tags: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      })

      return posts
    } catch (error) {
      console.error('Error fetching blogs:', error)
      throw error
    }
  },

  async getBySlug(slug) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          tags: true
        }
      })

      if (!post) throw new Error('Blog post not found')

      return post
    } catch (error) {
      console.error(`Error fetching blog with slug ${slug}:`, error)
      throw error
    }
  },

  async create(data) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to create a post')
      }

      // Generate a slug from the title
      const slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')

      // Create tags if they don't exist
      let tags = []
      if (data.tags && Array.isArray(data.tags)) {
        tags = await Promise.all(
          data.tags.map(async (tagName) => {
            // Try to find existing tag
            let tag = await prisma.tag.findUnique({
              where: { name: tagName }
            })

            // Create tag if it doesn't exist
            if (!tag) {
              tag = await prisma.tag.create({
                data: { name: tagName }
              })
            }

            return { id: tag.id }
          })
        )
      }

      // Create the post
      const post = await prisma.post.create({
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          published: data.published || false,
          featuredImage: data.featuredImage,
          authorId: currentUser.id,
          tags: {
            connect: tags
          }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          tags: true
        }
      })

      return post
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  },

  async update(slug, data) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to update a post')
      }

      // Get the existing post
      const existingPost = await prisma.post.findUnique({
        where: { slug },
        include: { tags: true }
      })

      if (!existingPost) {
        throw new Error('Post not found')
      }

      // Check if user is author or admin
      if (existingPost.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to update this post')
      }

      // Update tags if provided
      let tagsConnect = undefined
      let tagsDisconnect = undefined

      if (data.tags && Array.isArray(data.tags)) {
        // Get existing tag names
        const existingTagNames = existingPost.tags.map(tag => tag.name)

        // Find tags to add and remove
        const tagsToAdd = data.tags.filter(tag => !existingTagNames.includes(tag))
        const tagsToRemove = existingTagNames.filter(tag => !data.tags.includes(tag))

        // Create new tags and get their IDs
        const newTagIds = await Promise.all(
          tagsToAdd.map(async (tagName) => {
            let tag = await prisma.tag.findUnique({
              where: { name: tagName }
            })

            if (!tag) {
              tag = await prisma.tag.create({
                data: { name: tagName }
              })
            }

            return { id: tag.id }
          })
        )

        // Get IDs of tags to remove
        const removeTagIds = existingPost.tags
          .filter(tag => tagsToRemove.includes(tag.name))
          .map(tag => ({ id: tag.id }))

        if (newTagIds.length > 0) {
          tagsConnect = newTagIds
        }

        if (removeTagIds.length > 0) {
          tagsDisconnect = removeTagIds
        }
      }

      // Update the post
      const updateData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published,
        featuredImage: data.featuredImage,
        updatedAt: new Date()
      }

      // Add tags update if needed
      if (tagsConnect || tagsDisconnect) {
        updateData.tags = {}

        if (tagsConnect) {
          updateData.tags.connect = tagsConnect
        }

        if (tagsDisconnect) {
          updateData.tags.disconnect = tagsDisconnect
        }
      }

      const post = await prisma.post.update({
        where: { slug },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          tags: true
        }
      })

      return post
    } catch (error) {
      console.error(`Error updating blog with slug ${slug}:`, error)
      throw error
    }
  },

  async delete(slug) {
    try {
      const currentUser = model.currentUser

      if (!currentUser) {
        throw new Error('You must be logged in to delete a post')
      }

      // Get the existing post
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })

      if (!existingPost) {
        throw new Error('Post not found')
      }

      // Check if user is author or admin
      if (existingPost.authorId !== currentUser.id && currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to delete this post')
      }

      // Delete all comments first
      await prisma.comment.deleteMany({
        where: { postId: existingPost.id }
      })

      // Delete the post
      await prisma.post.delete({
        where: { slug }
      })

      return { success: true }
    } catch (error) {
      console.error(`Error deleting blog with slug ${slug}:`, error)
      throw error
    }
  }
}
