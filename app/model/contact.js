import { prisma } from '../lib/prisma.js'
import { model } from './index.js'

export const contact = {
  async submit(data) {
    try {
      // Validate the data
      if (!data.name || !data.email || !data.message) {
        throw new Error('Name, email, and message are required')
      }

      // Create a new contact submission
      const submission = await prisma.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          message: data.message
        }
      })

      return { success: true, id: submission.id }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },

  async getAll() {
    try {
      // Only allow admins to view contact submissions
      const currentUser = model.currentUser

      if (!currentUser || currentUser.role !== 'ADMIN') {
        throw new Error('You do not have permission to view contact submissions')
      }

      const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return submissions
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  }
}
