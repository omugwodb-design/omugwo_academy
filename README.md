<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12ukKshK4HIVkkcHli6zaHMzgjNrnhIg8

## Omugwo Academy

Modern Postnatal Education for African Families - A comprehensive digital platform combining education, community, support, and cultural relevance.

## 🌟 Features

### Marketing Website
- **Homepage** - Hero section, problem-solution, journey stages, courses preview, testimonials, FAQ
- **About Page** - Founder story, team, values, mission
- **Courses Page** - Course catalog with filtering and search

### Learning Management System (LMS)
- **Course Detail Pages** - Full curriculum, instructor info, pricing, testimonials
- **Learning Experience** - Video player, progress tracking, quizzes, notes, resources
- **Student Dashboard** - Progress overview, enrolled courses, achievements

### Community Platform
- **Discussion Spaces** - New Moms, Dads Lounge, Mental Health, Expert Corner
- **Posts & Comments** - Like, comment, share functionality
- **Anonymous Posting** - Safe space for sensitive topics
- **Gamification** - Badges, points, top contributors

### Webinar System
- **Live Webinars** - Registration, countdown, live sessions
- **Replays** - Access to past webinars
- **Free Masterclass** - Lead generation funnel

### Authentication
- **Sign Up / Sign In** - Email/password, social auth ready
- **User Profiles** - Avatar, settings, preferences

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe, Paystack (ready for integration)
- **Forms**: React Hook Form, Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/omugwo-academy.git
   cd omugwo-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and other API keys.

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to http://localhost:3000

## 📁 Project Structure

```bash
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   └── ui/              # Button, Card, Input, Badge, etc.
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── About.tsx        # About page
│   ├── Courses.tsx      # Course catalog
│   ├── CourseDetail.tsx # Individual course page
│   ├── Dashboard.tsx    # Student dashboard
│   ├── LearningExperience.tsx  # Video player & lessons
│   ├── Community.tsx    # Community platform
│   ├── Webinars.tsx     # Webinar listings
│   ├── Login.tsx        # Sign in
│   └── Register.tsx     # Sign up
├── stores/
│   ├── authStore.ts     # Authentication state
│   └── courseStore.ts   # Course/enrollment state
├── types/
│   ├── database.ts      # Supabase types
│   └── index.ts         # App types
├── App.tsx              # Main app with routes
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at supabase.com
2. Go to SQL Editor and run `supabase/schema.sql`
3. Enable Email Auth in Authentication settings
4. (Optional) Configure OAuth providers (Google, Facebook)

### Payment Integration
- **Paystack** (Nigeria): Get API keys from paystack.com
- **Stripe** (International): Get API keys from stripe.com

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Design System

### Colors
- **Primary**: Purple (#9333ea)
- **African Accents**: Terracotta, Gold, Sage
- **Neutrals**: Gray scale

### Typography
- **Display**: Playfair Display
- **Body**: Inter

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication via Supabase Auth
- Environment variables for sensitive data
- HTTPS enforced in production

## 📈 Future Roadmap

- [ ] Admin Dashboard
- [ ] Payment Integration (Paystack/Stripe)
- [ ] Certificate Generation
- [ ] Mobile App (React Native)
- [ ] AI Support Assistant
- [ ] Multi-language Support (Yoruba, Igbo, French)
- [ ] Hospital B2B Portal

## 📄 License

Copyright 2025 Omugwo Academy. All rights reserved.

## 🤝 Support

For support, email support@omugwoacademy.com

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
