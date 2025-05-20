# Nue Blog App

A full-featured blog application built with Nuejs, featuring user authentication, content management, comments, and more.

## Features

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
├── @library               # Reusable style components
├── @components            # Reusable components
├── api/                   # API endpoints
├── app/                   # Application-specific area
│   ├── model/             # Data models
│   ├── controllers/       # Application logic
│   ├── view/              # View components
├── blog/                  # Blog section
├── auth/                  # Authentication pages
├── about/                 # About section
├── contact/               # Contact section
├── portfolio/             # Portfolio section
├── case-studies/          # Case studies section
├── prisma/                # Prisma database
├── img/                   # Image assets
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime and package manager)
- [PostgreSQL](https://www.postgresql.org/) (Database)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nue-blog-app.git
   cd nue-blog-app
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up the database:
   ```
   # Create a .env file with your database URL
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/nue_blog" > .env
   
   # Generate Prisma client
   bunx prisma generate
   
   # Run migrations
   bunx prisma migrate dev
   ```

4. Start the development server:
   ```
   bun run dev
   ```

## Database Schema

The application uses Prisma with PostgreSQL. The schema includes models for:

- Users
- Posts
- Comments
- Tags
- Contact Submissions
- Portfolio Items
- Case Studies

## Deployment

To build for production:

```
bun run build
```

The static site will be generated in the `dist` directory, which can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
