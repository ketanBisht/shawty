# Shawty - URL Shortener

A high-performance URL shortener built with Next.js, Prisma, and Tailwind CSS. Hosted on Vercel.

## Features
- **Lightning Fast Redirects**: Caching strategy designed for high-scale environments.
- **Custom Aliases**: Claim your own custom short URLs (e.g., `shawty.vercel.app/my-link`).
- **Deduplication**: Automatically detects if a long URL has already been shortened and prevents duplicate entries in the database.
- **Modern UI**: A beautiful, glassmorphism-inspired UI with smooth animations.

## Getting Started

First, make sure you have linked a PostgreSQL database (like Vercel Postgres or Supabase). Set your database URL in `.env`:
```
DATABASE_URL="postgres://user:password@host/database"
```

Next, sync the Prisma schema and run the development server:

```bash
# Install dependencies
npm install

# Push schema to Postgres
npx prisma db push

# Start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

This project is configured to be deployed on Vercel. Ensure you add your `DATABASE_URL` to your Vercel Environment Variables before deploying!
