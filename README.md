# Shawty — The Brutal URL Shortener

![Shawty Hero](./public/hero.png)

**Shawty** is a high-performance, neobrutalist URL shortener built for the modern web. It combines a bold, unapologetic aesthetic with a lightning-fast technical foundation.

## Features

- **Brutal UI/UX**: High-contrast, accessibility-first Neobrutalist design powered by Tailwind CSS 4 and Framer Motion.
- **Deterministic Hashing**: Smart deduplication ensures the same destination URL always receives the same short ID, saving database space.
- **Custom Aliases**: Claim your own territory with custom slugs (e.g., `shawty.link/my-brand`).
- **Click Analytics**: Built-in tracking to monitor how many times your links are being hit.
- **Layered Caching**: A dual-layer strategy (Memory + DB) for sub-millisecond redirect performance.
- **Responsive**: Edge-to-edge brutalism that looks great on mobile, tablet, and desktop.

##  Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: Custom SVG Neobrutalist icons

## Getting Started

### 1. Prerequisites

- Node.js 18+ 
- A PostgreSQL database (Neon, Supabase, or Local)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/shawty.git
cd shawty
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shawty"
```

### 4. Database Initialization

Sync your schema with the database:

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start shortening.

## Project Structure

```text
├── app/             # Next.js App Router (Pages & API)
│   ├── [id]/        # Dynamic redirect route (The "Magic")
│   └── api/         # Backend shortening logic
├── lib/             # Core utilities (DB, Hashing, Caching)
├── prisma/          # Database schema & migrations
├── public/          # Static assets & branding
└── components/      # (Optional) Reusable UI blocks
```

##  License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with 🖤 and a lot of ☕
</p>
