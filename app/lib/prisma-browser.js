// This is a browser-compatible version of the Prisma client
// It provides mock functionality for client-side rendering

// Mock database for contact submissions
const contactSubmissions = [];

// Create a mock Prisma client for browser use
export const prisma = {
  contactSubmission: {
    create: async ({ data }) => {
      const newSubmission = {
        id: `submission-${Date.now()}`,
        ...data,
        createdAt: new Date()
      };
      contactSubmissions.push(newSubmission);
      console.log('Contact submission created:', newSubmission);
      return newSubmission;
    }
  }
};

export default prisma;
