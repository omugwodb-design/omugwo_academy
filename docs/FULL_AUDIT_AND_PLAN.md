# Omugwo Academy — Full System Audit & Implementation Plan

## Date: February 22, 2026

---

# PART 1: SITE BUILDER AUDIT

## 1.1 Current State

### Blocks Registered (15 in registry, 15 block files)
| Block | File | Inline Edit | Image Replace | Button Links | Variants | Animation |
|-------|------|:-----------:|:-------------:|:------------:|:--------:|:---------:|
| hero | hero-block.tsx | ✅ title, subtitle | ❌ sidebar only | ❌ no popover | ❌ 1 style | ⚠️ hardcoded |
| hero_split | hero-block.tsx (reused) | ✅ | ❌ | ❌ | ❌ same component | ⚠️ |
| features | features-block.tsx | ✅ title, subtitle, items | ❌ | N/A | ❌ 1 style | ⚠️ whileInView only |
| testimonials | testimonials-block.tsx | ✅ all fields | ❌ avatar URL text | N/A | ❌ 1 style | ⚠️ |
| cta | cta-block.tsx | ✅ title, subtitle, buttons | N/A | ❌ no popover | ✅ 3 variants | ⚠️ |
| faq | faq-block.tsx | ✅ questions + answers | N/A | N/A | ❌ 1 style | ✅ AnimatePresence |
| stats | stats-block.tsx | ✅ values, labels | N/A | N/A | ✅ 3 variants | ⚠️ |
| newsletter | newsletter-block.tsx | ✅ title, subtitle, button | N/A | N/A | ✅ 3 variants | ❌ none |
| pricing_table | pricing-block.tsx | ✅ all plan fields | N/A | ❌ no popover | ❌ 1 style | ⚠️ |
| content | content-block.tsx | ✅ title, body, button | ❌ sidebar only | ❌ no popover | ❌ 1 style | ❌ none |
| course_grid | course-grid-block.tsx | ✅ title, subtitle, CTA | ❌ | ❌ | ❌ 1 style | ⚠️ |
| webinar_reg | webinar-registration-block.tsx | ✅ most fields | ❌ sidebar only | ❌ | ❌ 1 style | ❌ |
| navigation | navigation-block.tsx | ✅ brand, links, CTA | N/A | ❌ no popover | ✅ 3 variants | ❌ |
| footer | footer-block.tsx | ✅ brand, desc, columns | N/A | N/A | ✅ 2 variants | ❌ |
| community_disc | community-discussions-block.tsx | ✅ title, items | N/A | N/A | ❌ 1 style | ⚠️ |
| blog_posts | blog-posts-block.tsx | ✅ title, posts | ❌ sidebar only | N/A | ❌ 1 style | ⚠️ |

### Legend
- ✅ = Fully implemented
- ⚠️ = Partially implemented (e.g. only one animation type, no user control)
- ❌ = Not implemented

## 1.2 Site Builder Gaps

### GAP-SB1: Default Website Not Loading
- `createImportedHomeBlocks()` exists and bootstraps a homepage when DB is empty
- **Issue**: Only triggers when `site_pages` table has 0 rows. If Supabase is unreachable or RLS blocks the query, the builder opens empty.
- **Fix**: Always bootstrap the imported blocks as fallback when no blocks load.

### GAP-SB2: No Image Upload/Replace UI
- Images are only changeable via the sidebar-right text/URL input field
- No click-to-replace overlay on images in the canvas
- No file upload integration (Supabase Storage or similar)

### GAP-SB3: No Button Link Popover Editor
- Button links are only editable via sidebar-right text fields
- No click-on-button → popover with URL, target, nofollow options
- Users must know to select block → find link field in sidebar

### GAP-SB4: Limited Block Variations
- Only 5 of 15 blocks have a `variant` prop (cta, stats, newsletter, navigation, footer)
- Most blocks have a single visual style with no way to switch layouts

### GAP-SB5: No Unified Animation System
- Some blocks have hardcoded `motion.div` with `whileInView`
- Hero has an `animation` select (none/fade/slideUp/zoom) but it's block-specific
- No global animation controls (entrance, scroll-triggered, hover, exit)
- No animation duration/delay/easing controls

### GAP-SB6: Missing Essential Business Blocks
Types defined in `types.ts` but NOT implemented:
- `video` — Video embed block
- `gallery` — Image gallery
- `team` — Team members grid
- `timeline` — Timeline/milestones
- `tabs` — Tabbed content
- `comparison` — Feature comparison table
- `logo_cloud` — Partner/client logos
- `countdown` — Countdown timer
- `contact` — Contact form
- `map` — Embedded map
- `divider/spacer` — Layout utilities

### GAP-SB7: No Visual Effects Panel
- No block-level controls for: box shadow, border radius, opacity, blur, filters
- Background gradient editor exists in sidebar-right but is basic (text input)
- No overlay controls beyond hero block

## 1.3 What's Working Well
- ✅ Drag-and-drop reordering (@dnd-kit)
- ✅ Inline text editing (contentEditable) on ALL text elements across all 15 blocks
- ✅ Undo/redo with 50-step history per page
- ✅ Multi-page support with page management
- ✅ Theme presets and global styles
- ✅ Template system with 15 templates
- ✅ Device preview (desktop/tablet/mobile)
- ✅ Autosave every 10 seconds
- ✅ Version history with restore
- ✅ Dynamic blocks (course_grid, webinar, blog, community) fetch from Supabase
- ✅ RBAC permissions for edit/publish/theme/pages/templates

---

# PART 2: LMS AUDIT

## 2.1 Current State

### Types (src/core/lms/types.ts) — COMPREHENSIVE
- Course → Module → Lesson → Activities hierarchy ✅
- 7 lesson types (video, text, pdf, quiz, assignment, reflection, live_session) ✅
- Quiz builder (MCQ, true/false, short_answer, scenario) with timing, shuffling, attempts ✅
- Assignments with rubrics and peer review ✅
- Drip content (immediate, date_based, progress_based, cohort_based) ✅
- Cohorts with schedules and live sessions ✅
- Progress tracking with streaks ✅
- Certificates with QR verification ✅
- Instructor dashboard types ✅

### Pages — MINIMAL
| Page | Status | Notes |
|------|--------|-------|
| `LearningExperience.tsx` | ⚠️ Basic | Fetches from Supabase, video player UI, sidebar curriculum, tabs (overview/resources/notes/discussion). But quiz/assignment/reflection UIs are NOT built. |
| `AdminCourseEditor.tsx` | ❌ Stub | Only creates a course with title/description/price. No module/lesson/quiz builder. No curriculum management. |
| `AdminCourses.tsx` | ⚠️ Basic | Lists courses, basic CRUD. No analytics. |
| `MyCourses.tsx` | ⚠️ Basic | Lists enrolled courses with progress bars. |
| `CourseDetail.tsx` | ✅ Good | Public course landing page with curriculum preview, pricing, enrollment CTA. |
| `Certificate.tsx` | ⚠️ Basic | Renders a certificate page but no generation logic. |
| `Checkout.tsx` | ✅ Good | Paystack + Stripe payment flow. |

### Supabase Tables (from schema_v2.sql)
- `courses`, `modules`, `lessons`, `lesson_progress`, `enrollments` — exist
- `cohorts`, `cohort_enrollments`, `cohort_schedule`, `cohort_live_sessions` — exist
- `assignments`, `assignment_submissions` — exist
- `user_streaks`, `notifications` — exist

## 2.2 LMS Gaps

### GAP-LMS1: No Admin Course Builder
- `AdminCourseEditor.tsx` is a stub — only title/description/price
- No module CRUD (add/reorder/delete modules)
- No lesson CRUD (add different lesson types, reorder, configure)
- No quiz builder UI (add questions, options, scoring)
- No assignment builder UI (rubrics, due dates, peer review config)
- No drip content configuration UI
- No course settings (prerequisites, tags, level, language, thumbnail upload)

### GAP-LMS2: No Quiz/Assessment Engine
- Types exist but no quiz-taking UI for students
- No quiz grading logic
- No quiz attempt tracking
- No timed quiz support
- No question randomization at runtime

### GAP-LMS3: No Assignment Submission/Grading
- Types exist but no submission UI for students
- No grading UI for instructors
- No rubric-based scoring UI
- No peer review workflow

### GAP-LMS4: No Progress Tracking Service
- `lesson_progress` table exists but no service layer to:
  - Mark lessons complete
  - Calculate module/course progress percentages
  - Track time spent
  - Manage streaks
  - Trigger certificate generation on completion

### GAP-LMS5: No Certificate Generation
- `Certificate.tsx` page exists but no actual generation
- No PDF generation
- No QR code generation
- No verification endpoint

### GAP-LMS6: No Drip Content Logic
- Types defined but no runtime logic to lock/unlock modules based on drip rules
- No UI to show locked content with unlock dates

### GAP-LMS7: No Instructor Dashboard
- Types defined but no page/component
- No student analytics, drop-off analysis, revenue tracking

### GAP-LMS8: No Course Analytics
- No completion rates, engagement metrics, quiz performance analytics

## 2.3 What's Working Well
- ✅ Comprehensive type system covering all LMS concepts
- ✅ Basic learning experience page with video player and curriculum sidebar
- ✅ Course detail/landing page
- ✅ Enrollment and payment flow (Paystack + Stripe)
- ✅ Supabase tables exist for core entities

---

# PART 3: COMMUNITY AUDIT

## 3.1 Current State

### CommunityApp.tsx — FULLY MOCK
- **All data is hardcoded** in `SPACES`, `POSTS`, `LEADERBOARD`, `EVENTS`, `BADGES` arrays
- No Supabase queries
- No real CRUD operations
- UI is comprehensive but entirely static

### Features Present (UI only, no backend)
- ✅ 6 community spaces with member/post counts
- ✅ Post feed with filtering by space and search
- ✅ Post creation form (text, images, video, files, hashtags, anonymous)
- ✅ Threaded replies with best answer marking
- ✅ Like, bookmark, share, report actions
- ✅ Gamification: points, badges, leaderboard
- ✅ Community events with RSVP
- ✅ Expert verification badges
- ✅ Moderation indicators (visibility, moderation level)
- ✅ Trending topics
- ✅ Dark mode styling

## 3.2 Community Gaps

### GAP-COM1: Entirely Mock Data
- Zero Supabase integration
- All spaces, posts, replies, events, badges are hardcoded arrays
- No real user authentication integration

### GAP-COM2: No CRUD Operations
- Post creation form exists but `handlePost()` is a no-op
- Like/bookmark/report buttons toggle local state only
- Reply input exists but doesn't submit
- Event RSVP doesn't persist

### GAP-COM3: No Real-time Features
- No Supabase Realtime subscriptions for new posts/replies
- No online member count (hardcoded)
- No live typing indicators

### GAP-COM4: No Moderation Backend
- Report button exists but no moderation queue
- No admin moderation dashboard
- No content filtering/auto-moderation

### GAP-COM5: No Gamification Backend
- Points system defined in UI but no calculation logic
- Badge earning criteria not implemented
- Leaderboard is static

### GAP-COM6: No File Upload
- Image/video/file attachment buttons exist but no upload logic
- No Supabase Storage integration

## 3.3 What's Working Well
- ✅ Comprehensive, polished UI with all community features represented
- ✅ Good UX patterns (anonymous posting, best answers, expert badges)
- ✅ Dark mode support
- ✅ Deep linking to specific posts via URL params

---

# PART 4: IMPLEMENTATION PLAN

## Phase 1: Site Builder Enhancements

### 1A. Default Website Loading (GAP-SB1)
- Ensure `createImportedHomeBlocks()` always fires as fallback
- Add loading state with skeleton UI while fetching from Supabase

### 1B. Block Variations for ALL Blocks
Add `variant` prop to every block that doesn't have one:
- **hero**: `centered` | `split` | `video-bg` | `minimal`
- **features**: `cards` | `icons-left` | `icons-top` | `minimal`
- **testimonials**: `cards` | `carousel` | `spotlight` | `minimal`
- **faq**: `accordion` | `two-column` | `cards`
- **pricing_table**: `cards` | `comparison` | `minimal`
- **content**: `image-right` | `image-left` | `full-width` | `cards`
- **course_grid**: `cards` | `list` | `featured-hero`
- **webinar_reg**: `split` | `centered` | `minimal`
- **community_disc**: `cards` | `list` | `compact`
- **blog_posts**: `cards` | `magazine` | `list`

### 1C. New Essential Blocks
1. **Team Block** — Grid of team members with photo, name, role, social links
2. **Video Block** — YouTube/Vimeo/custom embed with poster image
3. **Gallery Block** — Image grid with lightbox
4. **Countdown Block** — Countdown timer to a date
5. **Logo Cloud Block** — Partner/client logo strip
6. **Comparison Block** — Feature comparison table
7. **Timeline Block** — Vertical timeline with milestones
8. **Tabs Block** — Tabbed content sections
9. **Divider Block** — Decorative divider/spacer
10. **Contact Block** — Contact form with fields

### 1D. Animation System
- Create shared `AnimationWrapper` component
- Animation types: `none` | `fadeIn` | `slideUp` | `slideLeft` | `slideRight` | `zoomIn` | `bounce` | `flip`
- Trigger: `onLoad` | `onScroll` | `onHover`
- Controls: duration, delay, easing
- Add animation schema to every block's propSchema

### 1E. Image Upload Overlay
- Click any image in canvas → show overlay with "Replace Image" button
- Opens file picker → uploads to Supabase Storage → updates block prop
- Fallback: paste URL

### 1F. Button Link Popover
- Click any CTA button in canvas when selected → show popover
- Fields: URL, open in new tab, nofollow
- Apply to all blocks with CTA buttons

## Phase 2: LMS Implementation

### 2A. Supabase Schema + RLS
- Verify all LMS tables exist with correct columns
- Add RLS policies:
  - Students can read published courses, their own enrollments/progress
  - Instructors can manage their own courses
  - Admins can manage everything

### 2B. Admin Course Builder
- Full module/lesson CRUD with drag-and-drop reordering
- Lesson type configurator (video URL, text editor, PDF upload, quiz builder, assignment builder)
- Quiz builder: add questions, options, set correct answers, scoring
- Assignment builder: instructions, rubric, due date, file upload settings
- Course settings: thumbnail, category, level, prerequisites, drip config
- Preview mode

### 2C. Student Learning Experience
- Video player with progress tracking (auto-mark complete at 90%)
- Text/PDF lesson viewer
- Quiz engine: timed, shuffled, graded, show results
- Assignment submission: text + file upload
- Reflection prompts
- Progress sidebar with completion checkmarks
- Next/previous lesson navigation
- Notes per lesson (saved to Supabase)
- Discussion per lesson

### 2D. Progress Tracking Service
- `markLessonComplete()` — updates lesson_progress, recalculates module/course %
- `getProgress()` — returns full progress tree
- `updateStreak()` — daily streak tracking
- `checkCertificateEligibility()` — triggers cert generation at 100%

### 2E. Certificate Generation
- Generate certificate with student name, course name, date, instructor
- QR code linking to verification URL
- PDF download
- Public verification page

### 2F. Seed Data
- 3 complete courses with 3-5 modules each, 3-5 lessons per module
- Sample quizzes with questions
- Sample assignments
- Enrollment records for test users

## Phase 3: Community Implementation

### 3A. Supabase Integration
- Wire all CRUD to Supabase tables (community_spaces, community_posts, community_comments, community_likes, community_reports, community_events, community_event_rsvps, user_points, user_badges)
- Real-time subscriptions for new posts and comments

### 3B. Core Features
- Create/edit/delete posts with Supabase
- Like/unlike with optimistic updates
- Bookmark posts
- Threaded replies with best answer marking
- Report posts (creates moderation queue entry)
- File/image upload via Supabase Storage

### 3C. Gamification Backend
- Points service: award points for posting, replying, getting likes, best answers
- Badge criteria engine: check thresholds and award badges
- Leaderboard query (top N users by points)

### 3D. Moderation
- Admin moderation queue page
- Approve/reject/hide reported posts
- Auto-flag posts with certain keywords

### 3E. Events
- Create/edit community events
- RSVP with real persistence
- Event reminders

### 3F. Seed Data
- 6 spaces (already defined)
- 20+ sample posts across spaces
- 50+ sample comments/replies
- Sample events
- Sample user points and badges

## Phase 4: RLS Policies

### Site Builder
- `site_config`: public read, admin write
- `site_pages`: public read published, admin write
- `site_page_versions`: admin read/write

### LMS
- `courses`: public read published, instructor/admin write own
- `modules`: public read (via course), instructor/admin write
- `lessons`: enrolled students read, instructor/admin write
- `lesson_progress`: own user read/write
- `enrollments`: own user read, admin write
- `assignments`: enrolled read, instructor write
- `assignment_submissions`: own user + instructor read/write
- `certificates`: own user read, system write

### Community
- `community_spaces`: public read, admin write
- `community_posts`: space members read, authenticated write
- `community_comments`: post readers read, authenticated write
- `community_likes`: authenticated read/write own
- `community_reports`: authenticated write, moderator/admin read
- `community_events`: public read, admin write
- `community_event_rsvps`: authenticated read/write own
- `user_points`: own user read, system write
- `user_badges`: own user read, system write

---

# EXECUTION ORDER

1. **Site Builder Enhancements** (Phase 1) — Immediate
   - 1A: Default loading fix
   - 1B: Block variations
   - 1C: New blocks
   - 1D: Animation system
   - 1E: Image upload overlay
   - 1F: Button link popover

2. **Supabase Migrations** — Before LMS/Community implementation
   - Verify/create all tables
   - Apply RLS policies
   - Seed data

3. **LMS Implementation** (Phase 2)
   - Admin course builder
   - Student learning experience enhancements
   - Progress tracking service
   - Certificate generation

4. **Community Implementation** (Phase 3)
   - Wire to Supabase
   - Gamification backend
   - Moderation
   - Events

5. **Final Verification**
   - TypeScript check
   - Build check
   - Smoke test all flows
