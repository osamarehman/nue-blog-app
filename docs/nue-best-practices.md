# Best Practices for Nue.js Development

This comprehensive guide outlines best practices for developing with Nue.js, a standards-first web framework focused on simplicity and performance. By following these recommendations, you'll create maintainable, efficient, and user-friendly applications.

## Table of Contents

1. [Project Setup and Structure](#project-setup-and-structure)
2. [Content-First Development](#content-first-development)
3. [Component Architecture](#component-architecture)
4. [Styling Best Practices](#styling-best-practices)
5. [Performance Optimization](#performance-optimization)
6. [Routing and Navigation](#routing-and-navigation)
7. [State Management](#state-management)
8. [Working with Nuemark](#working-with-nuemark)
9. [Interactive Islands](#interactive-islands)
10. [Testing and Debugging](#testing-and-debugging)
11. [Deployment Strategies](#deployment-strategies)
12. [Example Walkthrough](#example-walkthrough)

## Project Setup and Structure

### Installation and Environment Setup

Start with a clean Bun installation, as Nue is optimized for Bun's superior web standards support:

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Nue globally
bun install --global nuekit

# Create a new project
nue create my-project-name
```

Choose the appropriate template based on your project needs:
- `simple-blog` for content-focused sites
- `simple-mpa` for multi-page applications with more interactivity

### Directory Structure

Follow Nue's recommended directory structure for optimal organization:

```
/
├── @global                # Global styles
│   ├── settings.css       # Variables and base settings
│   ├── colors.css         # Color palette
│   ├── typography.css     # Typography rules
├── @library               # Reusable style components
│   ├── button.css
│   ├── forms.css
│   ├── cards.css
├── index.md               # Front page content
├── site.yaml              # Global site configuration
├── app/                   # Application-specific area
│   ├── index.md           # App landing page
│   ├── app.yaml           # App-specific configuration
│   ├── model/             # Data models
│   ├── view/              # View components
│   ├── controllers/       # Application logic
├── blog/                  # Blog section
│   ├── index.md           # Blog landing page
│   ├── blog.yaml          # Blog configuration
│   ├── posts/             # Blog posts
├── docs/                  # Documentation section
│   ├── index.md           # Docs landing page
│   ├── docs.yaml          # Docs configuration
├── img/                   # Image assets
```

### Configuration Best Practices

Maintain clear separation between global and application-specific settings:

1. **Global Settings (`site.yaml`)**:
   ```yaml
   # site.yaml
   title: My Nue.js Project
   description: A standards-first web application
   author: Your Name

   # Global navigation
   mastnav:
     - title: Home
       href: /
     - title: Blog
       href: /blog/
     - title: Documentation
       href: /docs/

   # Default metadata
   meta:
     og_image: /img/og-image.png
     twitter_card: summary_large_image
   ```

2. **Application-Specific Settings**:
   ```yaml
   # app.yaml
   title: Application
   description: Interactive application section

   # App-specific navigation
   appnav:
     - title: Dashboard
       href: /app/dashboard/
     - title: Settings
       href: /app/settings/
   ```

## Content-First Development

### Start with Content Structure

Begin by defining your content structure before adding design or interactivity:

1. Create content files in Markdown (`.md`) with clear front matter:
   ```md
   ---
   title: Getting Started with Nue.js
   description: Learn how to build with Nue.js framework
   date: 2023-09-15
   author: Developer Name
   ---

   # Getting Started with Nue.js

   Nue.js is a standards-first web framework that prioritizes...
   ```

2. Organize content hierarchically, with each section in its own file or directory.

3. Use semantic headings (H1, H2, H3) to create a logical document outline.

### Content Metadata

Store structured data in YAML files for reuse across your site:

```yaml
# team.yaml
team_members:
  - name: Jane Smith
    role: Lead Developer
    bio: Jane has been developing web applications for over 10 years...
    image: /img/team/jane.jpg

  - name: John Doe
    role: UX Designer
    bio: John specializes in creating intuitive user experiences...
    image: /img/team/john.jpg
```

Reference this data in your Markdown content:

```md
## Our Team

[team-grid :members="team_members"]
```

## Component Architecture

### Server-Side Components

Define reusable server-side components in HTML files with Nue's template syntax:

```html
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
```

Use these components in your Markdown content:

```md
## Key Features

[feature-card
  title="Content-First Development"
  icon="content"
  description="Start with content and progressively enhance."
  link="/docs/content-first/"]

[feature-card
  title="Standards-Based"
  icon="standard"
  description="Built on web standards without proprietary abstractions."
  link="/docs/standards/"]
```

### Interactive Components

For client-side interactivity, create `.dhtml` or `.htm` files:

```html
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
```

### Component Composition

Compose complex interfaces from smaller components:

```html
<!-- components/product-card.html -->
<div @name="product-card" class="product-card">
  <product-image :src="image" :alt="title"/>
  <product-details :title="title" :price="price" :description="description"/>
  <add-to-cart :product-id="id"/>
</div>
```

## Styling Best Practices

### CSS Organization

1. **Global Styles**: Place base styles in the `@global` directory:
   ```css
   /* @global/typography.css */
   :root {
     --font-primary: system-ui, sans-serif;
     --font-heading: 'Montserrat', sans-serif;
     --font-size-base: 16px;
     --line-height-base: 1.5;
   }

   body {
     font-family: var(--font-primary);
     font-size: var(--font-size-base);
     line-height: var(--line-height-base);
   }

   h1, h2, h3, h4, h5, h6 {
     font-family: var(--font-heading);
     font-weight: 700;
     line-height: 1.2;
   }
   ```

2. **Component-Specific Styles**: Place in the same directory as the component:
   ```css
   /* components/feature-card.css */
   .feature-card {
     display: grid;
     gap: 1rem;
     padding: 2rem;
     border-radius: 8px;
     background: var(--color-surface);
     box-shadow: var(--shadow-sm);
   }

   .feature-card .icon {
     color: var(--color-primary);
     font-size: 2rem;
   }
   ```

3. **Page-Specific Styles**: Place in the same directory as the page content:
   ```css
   /* blog/styles.css */
   .blog-list {
     display: grid;
     gap: 2rem;
   }

   @media (min-width: 768px) {
     .blog-list {
       grid-template-columns: repeat(2, 1fr);
     }
   }
   ```

### CSS Custom Properties

Use CSS custom properties for consistent theming:

```css
/* @global/colors.css */
:root {
  /* Base colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #10b981;
  --color-accent: #8b5cf6;

  /* Neutral colors */
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;

  /* Feedback colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f9fafb;
    --color-text-light: #d1d5db;
    --color-background: #111827;
    --color-surface: #1f2937;
  }
}
```

## Performance Optimization

### Minimize JavaScript

1. Use interactive islands only where needed, keeping most content static.

2. Avoid large client-side libraries; Nue's built-in functionality is often sufficient.

3. Split JavaScript by route to load only what's needed:
   ```js
   // app/controllers/bootstrap.js
   import { router } from '/@nue/app-router.js'

   // Dynamically import modules based on route
   router.on('route:dashboard', async () => {
     const { initDashboard } = await import('./dashboard.js')
     initDashboard()
   })
   ```

### Image Optimization

Use Nuemark's responsive image syntax:

```md
[image]
  small: /img/hero-small.jpg
  large: /img/hero-large.jpg
  size: 1200 × 800
  alt: Hero image showing our product in action
```

For art-directed responsive images:

```md
[image]
  small: /img/mobile-hero.jpg
  medium: /img/tablet-hero.jpg
  large: /img/desktop-hero.jpg
  size: 1200 × 800
  alt: Hero image showing our product in action
```

### CSS Optimization

1. Use CSS custom properties for theming to avoid duplicate declarations.

2. Leverage modern CSS features like Grid and Flexbox instead of JavaScript for layout.

3. Use the cascade strategically with specific selectors only when needed.

## Routing and Navigation

### MPA Routing

For multi-page applications, use directory-based routing:

```
/
├── index.md           # Route: /
├── about/
│   └── index.md       # Route: /about/
├── blog/
│   ├── index.md       # Route: /blog/
│   └── post-slug.md   # Route: /blog/post-slug/
```

### SPA Routing

For single-page applications, configure the router in your bootstrap file:

```js
// app/controllers/bootstrap.js
import { router } from '/@nue/app-router.js'
import { model } from '../model/index.js'

router.configure({
  route: '/app/:section/:id',
  url_params: ['query', 'sort', 'filter'],
  session_params: ['view_mode', 'sidebar_open']
})

router.on('route:app', async ({ params }) => {
  await model.loadSection(params.section, params.id)
})
```

### Navigation Components

Create semantic navigation components:

```html
<!-- components/main-nav.html -->
<nav @name="main-nav" class="main-nav">
  <navi :items="mastnav"/>

  <button class="mobile-menu-toggle" aria-label="Toggle menu">
    <icon key="menu"/>
  </button>
</nav>
```

## State Management

### Model-Based State

Organize application state in a model directory:

```js
// app/model/index.js
import { createStore } from './store.js'
import { fetchData } from './api.js'

export const model = createStore({
  // Initial state
  state: {
    user: null,
    items: [],
    isLoading: false,
    error: null
  },

  // Actions
  async loadItems() {
    this.isLoading = true
    try {
      this.items = await fetchData('/api/items')
      this.error = null
    } catch (err) {
      this.error = err.message
    } finally {
      this.isLoading = false
    }
  },

  // Computed properties
  get isAuthenticated() {
    return !!this.user
  }
})
```

### Component State

For local component state, use the component's script section:

```html
<!-- components/product-filter.dhtml -->
<div @name="product-filter" class="product-filter">
  <div class="filter-options">
    <label>
      <input type="checkbox" :checked="showInStock" @change="toggleInStock">
      In Stock Only
    </label>

    <select @change="e => setCategory(e.target.value)">
      <option value="">All Categories</option>
      <option each="cat in categories" value="{ cat }">{ cat }</option>
    </select>
  </div>

  <script>
    export default {
      setup() {
        return {
          showInStock: false,
          categories: ['Electronics', 'Clothing', 'Home'],
          selectedCategory: ''
        }
      },

      toggleInStock() {
        this.showInStock = !this.showInStock
        this.emitChange()
      },

      setCategory(category) {
        this.selectedCategory = category
        this.emitChange()
      },

      emitChange() {
        this.dispatch('filter-change', {
          inStock: this.showInStock,
          category: this.selectedCategory
        })
      }
    }
  </script>
</div>
```

## Working with Nuemark

### Extended Markdown Syntax

Leverage Nuemark's extended syntax for rich content:

1. **Sections and Grids**:
   ```md
   [section.hero]
     # Welcome to Our Platform

     Start building amazing websites with Nue.js

     [button href="/docs/getting-started/" primary]Get Started[/button]
   [/section]

   [grid cols="1fr 1fr 1fr" gap="2rem"]
     [card]
       ## Feature One
       Description of feature one
     [/card]

     [card]
       ## Feature Two
       Description of feature two
     [/card]

     [card]
       ## Feature Three
       Description of feature three
     [/card]
   [/grid]
   ```

2. **Tabs and Accordions**:
   ```md
   [tabs]
     [tab name="Installation"]
       ## Installation

       ```sh
       bun install nuekit --global
       ```
     [/tab]

     [tab name="Configuration"]
       ## Configuration

       Edit your `site.yaml` file...
     [/tab]
   [/tabs]

   [accordion]
     [item title="How do I get started?"]
       Follow our quick start guide...
     [/item]

     [item title="Is Nue.js production-ready?"]
       Yes, Nue.js is being used in production...
     [/item]
   [/accordion]
   ```

3. **Custom Components**:
   ```md
   [pricing-table :plans="pricing_plans"]

   [testimonial
     quote="Nue.js has transformed our development workflow."
     author="Jane Smith"
     company="Acme Inc."]
   ```

### Content Organization

Organize content with clear hierarchical structure:

```md
# Main Heading

Introduction paragraph that sets the context.

## First Section

Content for the first section.

### Subsection

More detailed information.

## Second Section

Content for the second section.
```

## Interactive Islands

### Creating Islands

Create interactive islands as `.dhtml` or `.htm` files:

```html
<!-- components/newsletter-signup.dhtml -->
<form @name="newsletter-signup" class="newsletter-form" @submit.prevent="subscribe">
  <h3>Stay Updated</h3>
  <p>Subscribe to our newsletter for the latest updates.</p>

  <div class="form-group" :class="{ error: errors.email }">
    <input
      type="email"
      placeholder="Your email address"
      :value="email"
      @input="e => email = e.target.value"
      required
    >
    <div if="errors.email" class="error-message">{ errors.email }</div>
  </div>

  <button type="submit" :disabled="isSubmitting">
    <span if="!isSubmitting">Subscribe</span>
    <span if="isSubmitting">Subscribing...</span>
  </button>

  <div if="success" class="success-message">
    Thanks for subscribing!
  </div>

  <script>
    export default {
      setup() {
        return {
          email: '',
          errors: {},
          isSubmitting: false,
          success: false
        }
      },

      async subscribe() {
        // Reset state
        this.errors = {}
        this.isSubmitting = true
        this.success = false

        // Validate
        if (!this.email.includes('@')) {
          this.errors.email = 'Please enter a valid email address'
          this.isSubmitting = false
          return
        }

        try {
          // Submit form
          await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.email })
          })

          // Success
          this.success = true
          this.email = ''
        } catch (err) {
          this.errors.email = 'Failed to subscribe. Please try again.'
        } finally {
          this.isSubmitting = false
        }
      }
    }
  </script>
</form>
```

### Embedding Islands in Content

Embed interactive islands in your Markdown content:

```md
## Newsletter

Stay updated with our latest news and articles.

[newsletter-signup]
```

### Communication Between Islands

For communication between islands, use custom events:

```html
<!-- components/filter-sidebar.dhtml -->
<aside @name="filter-sidebar" class="filter-sidebar">
  <h3>Filter Products</h3>

  <div class="filter-group">
    <label>
      <input type="checkbox" :checked="inStock" @change="toggleInStock">
      In Stock Only
    </label>
  </div>

  <script>
    export default {
      setup() {
        return { inStock: false }
      },

      toggleInStock() {
        this.inStock = !this.inStock
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('filter-change', {
          detail: { inStock: this.inStock }
        }))
      }
    }
  </script>
</aside>
```

Then listen for these events in other components:

```html
<!-- components/product-list.dhtml -->
<div @name="product-list" class="product-list">
  <div each="product in filteredProducts" class="product-item">
    <h3>{ product.name }</h3>
    <p>{ product.price }</p>
  </div>

  <script>
    export default {
      setup() {
        return {
          products: [],
          filters: { inStock: false }
        }
      },

      mounted() {
        // Load products
        this.loadProducts()

        // Listen for filter changes
        window.addEventListener('filter-change', this.handleFilterChange)
      },

      unmounted() {
        window.removeEventListener('filter-change', this.handleFilterChange)
      },

      handleFilterChange(event) {
        this.filters = { ...this.filters, ...event.detail }
      },

      get filteredProducts() {
        return this.products.filter(product => {
          if (this.filters.inStock && !product.inStock) return false
          return true
        })
      }
    }
  </script>
</div>
```

## Testing and Debugging

### Development Server

Use Nue's development server with hot reloading for rapid iteration:

```sh
# Start development server
nue
```

### Browser DevTools

Use browser DevTools to inspect and debug your Nue.js applications:

1. **Elements Panel**: Inspect the rendered HTML structure.
2. **Console**: View logs and errors.
3. **Network Panel**: Monitor API requests and responses.
4. **Application Panel**: Inspect local storage and session storage.

### Common Debugging Techniques

1. **Component Inspection**: Add debug output to your components:
   ```html
   <div @name="debug-component">
     <pre>{ JSON.stringify(debugData, null, 2) }</pre>

     <script>
       export default {
         setup() {
           return {
             get debugData() {
               return {
                 // Properties to debug
                 count: this.count,
                 items: this.items,
                 computed: this.someComputedValue
               }
             }
           }
         }
       }
     </script>
   </div>
   ```

2. **Event Logging**: Log events to understand component lifecycle:
   ```js
   export default {
     mounted() {
       console.log('Component mounted', this.id)
     },

     updated() {
       console.log('Component updated', this.id)
     },

     unmounted() {
       console.log('Component unmounted', this.id)
     }
   }
   ```

## Deployment Strategies

### Static Site Deployment

For content-focused sites, build a static version for deployment:

```sh
# Build for production
nue build -p
```

Deploy the generated files in the `dist` directory to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Cloudflare Pages

### SPA Deployment

For single-page applications, ensure proper server configuration:

1. **Configure redirects** to handle client-side routing:
   ```
   /* /index.html 200
   ```

2. **Set cache headers** appropriately:
   - HTML: No cache or short cache
   - CSS/JS: Long cache with versioning
   - Static assets: Long cache

### Performance Monitoring

Monitor your site's performance after deployment:

1. Use Lighthouse in Chrome DevTools to measure:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

2. Set up Real User Monitoring (RUM) to track actual user experiences.

## Example Walkthrough

Let's walk through a practical example using the `simple-blog` template to understand Nue.js best practices in action.

### Creating a Blog with Nue.js

1. **Initialize the Project**:
   ```sh
   # Install Nue globally
   bun install --global nuekit

   # Create a new blog project
   nue create simple-blog

   # Navigate to the project directory
   cd simple-blog

   # Start the development server
   nue
   ```

2. **Explore the Project Structure**:
   ```
   /
   ├── @global                # Global styles
   │   ├── colors.css         # Color variables
   │   ├── typography.css     # Typography styles
   ├── @library               # Reusable components
   │   ├── button.css         # Button styles
   │   ├── card.css           # Card component styles
   ├── blog                   # Blog section
   │   ├── index.md           # Blog landing page
   │   ├── blog.yaml          # Blog configuration
   │   ├── posts/             # Blog posts
   ├── img                    # Image assets
   ├── index.md               # Home page
   ├── site.yaml              # Global site configuration
   ```

3. **Examine the Configuration**:
   ```yaml
   # site.yaml
   title: My Nue.js Blog
   description: A blog built with Nue.js

   # Global navigation
   mastnav:
     - title: Home
       href: /
     - title: Blog
       href: /blog/
     - title: About
       href: /about/
   ```

4. **Create a New Blog Post**:
   ```md
   ---
   title: Getting Started with Nue.js
   description: Learn how to build with the Nue.js framework
   date: 2023-09-15
   image: /img/blog/getting-started.jpg
   ---

   # Getting Started with Nue.js

   Nue.js is a standards-first web framework that prioritizes simplicity and performance.

   ## Installation

   [code language="sh"]
   # Install Bun
   curl -fsSL https://bun.sh/install | bash

   # Install Nue globally
   bun install --global nuekit
   [/code]

   ## Creating Your First Project

   Let's create a simple blog project:

   [code language="sh"]
   nue create simple-blog
   [/code]
   ```

5. **Add an Interactive Component**:
   ```html
   <!-- components/comment-form.dhtml -->
   <form @name="comment-form" class="comment-form" @submit.prevent="submitComment">
     <h3>Leave a Comment</h3>

     <div class="form-group">
       <label for="name">Name</label>
       <input
         id="name"
         type="text"
         :value="name"
         @input="e => name = e.target.value"
         required
       >
     </div>

     <div class="form-group">
       <label for="comment">Comment</label>
       <textarea
         id="comment"
         :value="comment"
         @input="e => comment = e.target.value"
         required
       ></textarea>
     </div>

     <button type="submit" :disabled="isSubmitting">
       Submit Comment
     </button>

     <div if="success" class="success-message">
       Comment submitted successfully!
     </div>

     <script>
       export default {
         setup() {
           return {
             name: '',
             comment: '',
             isSubmitting: false,
             success: false
           }
         },

         async submitComment() {
           this.isSubmitting = true

           // Simulate API call
           await new Promise(resolve => setTimeout(resolve, 1000))

           this.success = true
           this.name = ''
           this.comment = ''
           this.isSubmitting = false
         }
       }
     </script>
   </form>
   ```

6. **Use the Component in Blog Posts**:
   ```md
   ## Join the Discussion

   [comment-form]
   ```

7. **Build for Production**:
   ```sh
   # Build for production
   nue build -p

   # The static site is now in the dist/ directory
   ```

This example demonstrates the core principles of Nue.js development:
- Content-first approach with Markdown
- Clean separation of concerns
- Progressive enhancement with interactive islands
- Simple deployment process

By following these best practices, you can create fast, maintainable, and user-friendly websites and applications with Nue.js.