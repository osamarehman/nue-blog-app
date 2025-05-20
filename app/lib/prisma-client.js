// This is a mock implementation of the Prisma client
// In a real application, you would use the actual Prisma client
// This is a workaround for the bare specifier issue in the browser

// Mock database for users
const users = [
  {
    id: 1,
    name: 'User',
    email: 'user@example.com',
    password: 'password', // In a real app, this would be hashed
    role: 'USER'
  },
  {
    id: 2,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'adminpassword', // In a real app, this would be hashed
    role: 'ADMIN'
  }
];

// Mock database for blog posts
const posts = [
  {
    id: 1,
    title: 'Getting Started with Nue.js',
    slug: 'getting-started-with-nuejs',
    content: 'This is a sample blog post about Nue.js...',
    authorId: 2,
    published: true,
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: 2,
    title: 'Building a Blog with Nue.js',
    slug: 'building-a-blog-with-nuejs',
    content: 'Learn how to build a blog with Nue.js...',
    authorId: 1,
    published: true,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-06-20')
  }
];

// Mock database for comments
const comments = [
  {
    id: 1,
    content: 'Great article!',
    authorId: 1,
    postId: 1,
    createdAt: new Date('2023-05-16'),
    updatedAt: new Date('2023-05-16')
  }
];

// Create a mock Prisma client
export function createPrismaClient() {
  return {
    user: {
      findUnique: async ({ where }) => {
        if (where.id) {
          return users.find(user => user.id === where.id);
        }
        if (where.email) {
          return users.find(user => user.email === where.email);
        }
        return null;
      },
      create: async ({ data, select }) => {
        const newUser = {
          id: users.length + 1,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        users.push(newUser);
        
        if (select) {
          const selectedUser = {};
          Object.keys(select).forEach(key => {
            if (select[key] && newUser[key] !== undefined) {
              selectedUser[key] = newUser[key];
            }
          });
          return selectedUser;
        }
        
        return newUser;
      },
      update: async ({ where, data }) => {
        const userIndex = users.findIndex(user => user.id === where.id);
        if (userIndex === -1) return null;
        
        users[userIndex] = {
          ...users[userIndex],
          ...data,
          updatedAt: new Date()
        };
        
        return users[userIndex];
      }
    },
    post: {
      findMany: async ({ where, orderBy, include }) => {
        let filteredPosts = [...posts];
        
        if (where) {
          if (where.published !== undefined) {
            filteredPosts = filteredPosts.filter(post => post.published === where.published);
          }
          if (where.authorId !== undefined) {
            filteredPosts = filteredPosts.filter(post => post.authorId === where.authorId);
          }
        }
        
        if (orderBy && orderBy.createdAt === 'desc') {
          filteredPosts.sort((a, b) => b.createdAt - a.createdAt);
        }
        
        if (include && include.author) {
          filteredPosts = filteredPosts.map(post => ({
            ...post,
            author: users.find(user => user.id === post.authorId)
          }));
        }
        
        return filteredPosts;
      },
      findUnique: async ({ where, include }) => {
        let post;
        
        if (where.id) {
          post = posts.find(p => p.id === where.id);
        } else if (where.slug) {
          post = posts.find(p => p.slug === where.slug);
        }
        
        if (!post) return null;
        
        if (include && include.author) {
          post = {
            ...post,
            author: users.find(user => user.id === post.authorId)
          };
        }
        
        if (include && include.comments) {
          post = {
            ...post,
            comments: comments.filter(comment => comment.postId === post.id)
          };
        }
        
        return post;
      },
      create: async ({ data }) => {
        const newPost = {
          id: posts.length + 1,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        posts.push(newPost);
        return newPost;
      },
      update: async ({ where, data }) => {
        const postIndex = posts.findIndex(post => {
          if (where.id) return post.id === where.id;
          if (where.slug) return post.slug === where.slug;
          return false;
        });
        
        if (postIndex === -1) return null;
        
        posts[postIndex] = {
          ...posts[postIndex],
          ...data,
          updatedAt: new Date()
        };
        
        return posts[postIndex];
      },
      delete: async ({ where }) => {
        const postIndex = posts.findIndex(post => {
          if (where.id) return post.id === where.id;
          if (where.slug) return post.slug === where.slug;
          return false;
        });
        
        if (postIndex === -1) return null;
        
        const deletedPost = posts[postIndex];
        posts.splice(postIndex, 1);
        
        // Also delete related comments
        comments = comments.filter(comment => comment.postId !== deletedPost.id);
        
        return deletedPost;
      }
    },
    comment: {
      findMany: async ({ where }) => {
        let filteredComments = [...comments];
        
        if (where && where.postId) {
          filteredComments = filteredComments.filter(comment => comment.postId === where.postId);
        }
        
        return filteredComments;
      },
      create: async ({ data }) => {
        const newComment = {
          id: comments.length + 1,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        comments.push(newComment);
        return newComment;
      },
      delete: async ({ where }) => {
        const commentIndex = comments.findIndex(comment => comment.id === where.id);
        if (commentIndex === -1) return null;
        
        const deletedComment = comments[commentIndex];
        comments.splice(commentIndex, 1);
        
        return deletedComment;
      }
    }
  };
}

