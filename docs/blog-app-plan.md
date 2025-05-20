# Blog App Development Plan with Nuejs

This document outlines the plan for creating a full-featured blog application using Nuejs, incorporating user authentication, content management, and various pages.

## Project Overview

We'll build a blog application with the following features:
- User authentication (login/signup)
- User profiles
- Content publishing system (for users and admins)
- Comments system
- About page
- Contact page with form submission
- Portfolio page
- Case study page
- Database integration with Prisma

## Project Structure

```
/
├── @global                # Global styles
│   ├── settings.css       # Variables and base settings
│   ├── colors.css         # Color palette
│   ├── typography.css     # Typography rules
│   ├── layout.css         # Layout components
│   ├── layout.html        # Main layout template
├── @library               # Reusable style components
│   ├── button.css         # Button styles
│   ├── forms.css          # Form styles
│   ├── cards.css          # Card styles
│   ├── comments.css       # Comment styles
├── @components            # Reusable components
│   ├── nav-bar.html       # Navigation bar
│   ├── footer.html        # Footer component
│   ├── comment-form.dhtml # Interactive comment form
│   ├── login-form.dhtml   # Interactive login form
│   ├── signup-form.dhtml  # Interactive signup form
│   ├── user-card.html     # User card component
│   ├── blog-card.html     # Blog card component
├── api/                   # API endpoints
│   ├── index.js           # API router
│   ├── auth.js            # Authentication endpoints
│   ├── blogs.js           # Blog endpoints
│   ├── comments.js        # Comment endpoints
│   ├── users.js           # User endpoints
│   ├── contact.js         # Contact form endpoint
├── app/                   # Application-specific area
│   ├── model/             # Data models
│   │   ├── index.js       # Main model
│   │   ├── auth.js        # Authentication model
│   │   ├── blogs.js       # Blog model
│   │   ├── comments.js    # Comments model
│   │   ├── users.js       # Users model
│   ├── controllers/       # Application logic
│   │   ├── bootstrap.js   # Main controller
│   │   ├── auth.js        # Auth controller
│   │   ├── blogs.js       # Blog controller
│   ├── view/              # View components
│   │   ├── admin-panel.dhtml  # Admin panel
│   │   ├── user-profile.dhtml # User profile
│   │   ├── blog-editor.dhtml  # Blog editor
├── blog/                  # Blog section
│   ├── index.md           # Blog landing page
│   ├── blog.yaml          # Blog configuration
│   ├── [slug].md          # Dynamic blog post template
├── auth/                  # Authentication pages
│   ├── login.md           # Login page
│   ├── signup.md          # Signup page
│   ├── profile.md         # Profile page
├── about/                 # About section
│   ├── index.md           # About page
├── contact/               # Contact section
│   ├── index.md           # Contact page
│   ├── thanks.md          # Thank you page
├── portfolio/             # Portfolio section
│   ├── index.md           # Portfolio page
│   ├── [slug].md          # Dynamic portfolio item
├── case-studies/          # Case studies section
│   ├── index.md           # Case studies page
│   ├── [slug].md          # Dynamic case study
├── prisma/                # Prisma database
│   ├── schema.prisma      # Prisma schema
│   ├── seed.js            # Seed data
├── img/                   # Image assets
├── index.md               # Home page
├── site.yaml              # Global site configuration
```

## Database Schema (Prisma)

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  bio           String?
  avatar        String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
  comments      Comment[]
}

enum Role {
  USER
  ADMIN
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  published   Boolean   @default(false)
  featuredImage String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  comments    Comment[]
  tags        Tag[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  image       String
  link        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CaseStudy {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  featuredImage String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Implementation Plan

### Phase 1: Project Setup and Basic Structure
1. Initialize Nuejs project with `nue create blog-app`
2. Set up project structure according to the plan
3. Configure global styles and layout
4. Create basic pages (home, about, contact)

### Phase 2: Database Integration
1. Set up Prisma with PostgreSQL
2. Define schema and generate client
3. Create database connection utility
4. Set up API endpoints for CRUD operations

### Phase 3: Authentication System
1. Implement user signup/login forms
2. Create authentication API endpoints
3. Implement session management
4. Create user profile page

### Phase 4: Blog System
1. Implement blog listing page
2. Create blog post template
3. Implement blog post creation/editing for users
4. Implement admin panel for content management

### Phase 5: Comments System
1. Create comment component
2. Implement comment submission form
3. Set up API endpoints for comments

### Phase 6: Additional Pages
1. Implement portfolio page and items
2. Create case studies section
3. Finalize contact form with submission handling

### Phase 7: Testing and Refinement
1. Test all features and fix bugs
2. Optimize performance
3. Improve UI/UX
4. Deploy the application

## Next Steps

Let's begin by setting up the project structure and implementing the basic pages. We'll then move on to database integration and authentication.
