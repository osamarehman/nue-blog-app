---
title: Building Components with Nuejs
description: Learn how to create reusable components in Nuejs
date: 2023-09-20
image: /img/blog/components.jpg
author: Admin User
---

# Building Components with Nuejs

Nuejs makes it easy to create reusable components for your web applications.

## Server-Side Components

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

## Interactive Components

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

