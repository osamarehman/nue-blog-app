import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.caseStudy.deleteMany({});

  console.log('Seeding database...');

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // "adminpassword"
      bio: 'Site administrator and main content creator.',
      avatar: '/img/avatars/admin.jpg',
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: '$2a$10$dQQlVExX5hv3dQAm8gRf/uaQH3znNgEZRRDTWvixnGQkO1gHzWU4e', // "password"
      bio: 'Regular user who loves to comment on blog posts.',
      avatar: '/img/avatars/user.jpg',
      role: 'USER',
    },
  });

  console.log('Created users');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Nuejs' } }),
    prisma.tag.create({ data: { name: 'Web Development' } }),
    prisma.tag.create({ data: { name: 'JavaScript' } }),
    prisma.tag.create({ data: { name: 'CSS' } }),
    prisma.tag.create({ data: { name: 'HTML' } }),
    prisma.tag.create({ data: { name: 'Tutorial' } }),
  ]);

  console.log('Created tags');

  // Create blog posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Nuejs',
      slug: 'getting-started-with-nuejs',
      content: `# Getting Started with Nuejs

Nuejs is a standards-first web framework that prioritizes simplicity and performance.

## Installation

\`\`\`sh
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Nue globally
bun install --global nuekit
\`\`\`

## Creating Your First Project

Let's create a simple blog project:

\`\`\`sh
nue create simple-blog
\`\`\`

## Key Features of Nuejs

Nuejs offers several advantages over traditional frameworks:

1. **Content-First Development**: Start with content and progressively enhance.
2. **Standards-Based**: Built on web standards without proprietary abstractions.
3. **Performance-Focused**: Minimal JavaScript, optimal loading strategies.
4. **Developer Experience**: Simple, intuitive API with minimal boilerplate.
`,
      excerpt: 'Learn how to build with the Nuejs framework',
      published: true,
      featuredImage: '/img/blog/getting-started.jpg',
      authorId: adminUser.id,
      tags: {
        connect: [
          { id: tags[0].id }, // Nuejs
          { id: tags[1].id }, // Web Development
          { id: tags[5].id }, // Tutorial
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Building Components with Nuejs',
      slug: 'building-components-with-nuejs',
      content: `# Building Components with Nuejs

Nuejs makes it easy to create reusable components for your web applications.

## Server-Side Components

Define reusable server-side components in HTML files with Nue's template syntax:

\`\`\`html
<!-- components/feature-card.html -->
<div @name="feature-card" class="feature-card">
  <div class="icon">
    <icon :key="icon"/>
  </div>

  <h3>{ title }</h3>

  <div class="description">
    <markdown :content="description"/>
  </div>

  <a href="{ link }" class="learn-more">Learn more</a>
</div>
\`\`\`

## Interactive Components

For client-side interactivity, create \`.dhtml\` or \`.htm\` files:

\`\`\`html
<!-- components/counter.dhtml -->
<div @name="counter" class="counter">
  <button @click="decrement">-</button>
  <span>{ count }</span>
  <button @click="increment">+</button>

  <script>
    export default {
      setup() {
        return { count: 0 }
      },

      increment() {
        this.count++
      },

      decrement() {
        if (this.count > 0) this.count--
      }
    }
  </script>
</div>
\`\`\`
`,
      excerpt: 'Learn how to create reusable components in Nuejs',
      published: true,
      featuredImage: '/img/blog/components.jpg',
      authorId: adminUser.id,
      tags: {
        connect: [
          { id: tags[0].id }, // Nuejs
          { id: tags[2].id }, // JavaScript
          { id: tags[5].id }, // Tutorial
        ],
      },
    },
  });

  console.log('Created blog posts');

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Great introduction to Nuejs! Looking forward to trying it out.',
      postId: post1.id,
      authorId: regularUser.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'The component system is really intuitive. Thanks for the examples!',
      postId: post2.id,
      authorId: regularUser.id,
    },
  });

  console.log('Created comments');

  // Create portfolio items
  await prisma.portfolio.create({
    data: {
      title: 'E-commerce Website',
      slug: 'ecommerce-website',
      description: 'A modern e-commerce website built with Nuejs and Prisma.',
      image: '/img/portfolio/ecommerce.jpg',
      link: 'https://example.com/ecommerce',
    },
  });

  await prisma.portfolio.create({
    data: {
      title: 'Blog Platform',
      slug: 'blog-platform',
      description: 'A content-focused blog platform with advanced features.',
      image: '/img/portfolio/blog.jpg',
      link: 'https://example.com/blog',
    },
  });

  console.log('Created portfolio items');

  // Create case studies
  await prisma.caseStudy.create({
    data: {
      title: 'Migrating from React to Nuejs',
      slug: 'migrating-from-react-to-nuejs',
      content: `# Migrating from React to Nuejs

## Background

Our client was experiencing performance issues with their React-based website. The site was slow to load and had poor SEO performance.

## Solution

We migrated the site to Nuejs, focusing on content-first development and progressive enhancement.

## Results

- 80% reduction in JavaScript bundle size
- 95% improvement in Lighthouse performance score
- 50% increase in organic search traffic
`,
      featuredImage: '/img/case-studies/react-to-nuejs.jpg',
    },
  });

  console.log('Created case studies');

  // Create contact submissions
  await prisma.contactSubmission.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I would like to learn more about your services.',
    },
  });

  console.log('Created contact submissions');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
