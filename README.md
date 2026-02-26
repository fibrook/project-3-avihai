# ObserVacation

> A premium Vacation Tracking System built as a Full Stack course final project.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (TypeScript), Tailwind CSS, Shadcn UI |
| State Management | Redux Toolkit |
| Backend & Auth | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Charts | Recharts |
| Build Tool | Vite |

## Features

- **Authentication** – Username + password login/register with role-based access (admin/user)
- **Vacation Management** – CRUD operations with image upload (admin only)
- **Follow System** – Users can follow/unfollow vacations in real-time
- **Admin Dashboard** – Statistics cards, bar charts, pie charts, and trend analysis
- **Responsive Design** – Mobile-first, fully responsive on all devices
- **Real-Time Updates** – Supabase Realtime subscriptions for instant data sync

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profile data (first name, last name, unique username) |
| `vacations` | Vacation listings (destination, dates, price, image, description) |
| `followers` | Many-to-many relationship between users and vacations |
| `user_roles` | Role assignments (admin / user) |

**Key Functions:** `handle_new_user` (trigger), `has_role`, `get_email_by_username`, `get_vacation_follower_counts`

---

## Prompt History

All prompts exchanged during development, in chronological order.

### #1 — Project Setup & Architecture

> Build a "Vacation Tracking System" called "Observacation" with React + TypeScript + Tailwind + Shadcn UI. Use Supabase for backend, auth, and real-time. Create profiles, vacations, and followers tables with RLS policies. Make it mobile-first and premium-looking.

**Result:** Full project scaffolded — database tables, auth flow, dashboard, vacation cards with follow/unfollow, admin CRUD, image upload to Storage, and responsive UI.

### #2 — Requirements Validation

> Does this project meet all instructor requirements?

**Result:** Confirmed full compliance — React/TS, Supabase backend, Realtime, proper DB schema, RLS, roles, and responsiveness.

### #3 — Supabase Approval

> Everything looks good. Just confirming Supabase is allowed as the backend.

**Result:** Confirmed all features are properly implemented with Supabase.

### #4 — End-to-End Testing

> Test the login flow with username+password, then log in as admin and test adding a vacation with image upload.

**Result:** Full E2E test passed — login, admin access, vacation creation with image upload, edit, and delete all working.

### #5 — Create Admin User

> Create a test admin user — username: `admin`, password: `Test1234!`

**Result:** Admin user created via temporary Edge Function with email `admin@observacation.com` and admin role assigned.

### #6 — Admin Reports Page

> Add an AdminReports page with charts and statistics about vacations and followers.

**Result:** Created `AdminReports.tsx` with bar chart (followers per vacation), pie chart (price distribution), stat cards, and real-time data via RPC.

### #7 — Seed Test Data

> Generate 30 vacations worldwide with images, 10 test users, and random follow relationships for demo purposes.

**Result:** Seeded via temporary Edge Function:
- **30 vacations** — real destinations (Paris, Tokyo, Santorini, Bali, etc.) with Unsplash images
- **10 users** — `sarah_c`, `david_l`, `maya_b`, `yossi_k`, `noa_r`, `amit_s`, `liora_g`, `oren_m`, `shira_d`, `eyal_p` (password: `Test1234!`)
- **103 follow relationships** — randomly distributed across users and vacations

### #8 — Document Prompts in README

> Add all prompts to the README file.

**Result:** README updated with prompt history section.

### #9 — Expand README with Full Conversation

> Include the complete conversation history — both user prompts and AI responses.

**Result:** README rewritten with detailed prompt-response pairs.

### #10 — Clean Up & Professionalize README

> Reorganize the README — clear, concise, professional, in English.

**Result:** Final README with clean structure, tech stack table, feature list, DB schema overview, and numbered prompt history.

---

## Getting Started

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) → Share → Publish.
