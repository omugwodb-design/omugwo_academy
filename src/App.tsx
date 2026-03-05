import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SupabaseAuthProvider } from './components/auth/SupabaseAuthProvider';
import {
  Home, About, Courses, CourseDetail, Dashboard, MyCourses,
  Login, Register, ForgotPassword, ResetPassword, PremiumLearningExperience, Community, Webinars,
  Contact, Blog, Podcast, Cart, Checkout, CheckoutSuccess,
  Certificate, VerifyCertificate, PrivacyPolicy, TermsOfService,
  RefundPolicy, Team, Careers, DynamicSitePage, SmartHome
} from './pages';

import { InvitePage } from './pages/InvitePage';
import {
  AdminDashboard, AdminCourses, AdminUsers, AdminPayments,
  AdminWebinars, AdminCommunity, AdminLeads, AdminCertificates,
  AdminSettings, AdminCourseEditor, AdminCoupons
} from './pages/admin';
import { SiteBuilder } from './core/sitebuilder/site-builder';
import { CommunityApp } from './pages/community/CommunityApp';
import { WebinarSystem } from './pages/webinars/WebinarSystem';
import { AuthEventHandler } from './components/auth/AuthEventHandler';

// Course Layout Imports
import { CinematicCoursePage } from './pages/course-layouts/CinematicLayout';
import { PlayfulLayout } from './pages/course-layouts/PlayfulLayout';
import { MinimalistLayout } from './pages/course-layouts/MinimalistLayout';
import { TechLayout } from './pages/course-layouts/TechLayout';
import { LuxuryLayout } from './pages/course-layouts/LuxuryLayout';
import { StorytellingLayout } from './pages/course-layouts/StorytellingLayout';
import { CulturalLayout } from './pages/course-layouts/CulturalLayout';
import { ScientificLayout } from './pages/course-layouts/ScientificLayout';
import { AppDashboardLayout } from './pages/course-layouts/AppDashboardLayout';
import { SalesFocusedLayout } from './pages/course-layouts/SalesFocusedLayout';

export const App: React.FC = () => {
  return (
    <SupabaseAuthProvider>
      <Router>
        <AuthEventHandler />
        <Layout>
          <Routes>
            {/* ââââ Public Routes ââââ */}
            <Route path="/" element={<SmartHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/community" element={<Community />} />
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/certificate/:certificateNumber" element={<Certificate />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />

            {/* ââââ Course Showcase Pages ââââ */}
            <Route path="/showcase/course-cinematic" element={<CinematicCoursePage />} />
            <Route path="/showcase/course-playful" element={<PlayfulLayout />} />
            <Route path="/showcase/course-minimalist" element={<MinimalistLayout />} />
            <Route path="/showcase/course-tech" element={<TechLayout />} />
            <Route path="/showcase/course-luxury" element={<LuxuryLayout />} />
            <Route path="/showcase/course-storytelling" element={<StorytellingLayout />} />
            <Route path="/showcase/course-app" element={<AppDashboardLayout />} />
            <Route path="/showcase/course-sales-focused" element={<SalesFocusedLayout />} />
            <Route path="/showcase/course-cultural" element={<CulturalLayout />} />
            <Route path="/showcase/course-scientific" element={<ScientificLayout />} />

            {/* ââââ Invite page (no layout) ââââ */}
            <Route path="/invite" element={<InvitePage />} />

            {/* ââââ Dynamic Site Builder Pages ââââ */}
            <Route path="/p/:slug" element={<DynamicSitePage />} />

            {/* Public Course Detail Page */}
            <Route path="/courses/:courseId" element={<CourseDetail />} />

            {/* Course Student Preview (Instructor/Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin', 'super_admin']} />}>
              <Route path="/course-preview/:courseId" element={<PremiumLearningExperience />} />
              <Route path="/course-preview/:courseId/:lessonId" element={<PremiumLearningExperience />} />
            </Route>

            {/* ââââ Student / Instructor Dashboard ââââ */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'super_admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-courses" element={<MyCourses />} />
            </Route>

            {/* ââââ Checkout flow ââââ */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:courseId" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />

            {/* ââââ Learning experience ââââ */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'super_admin']} />}>
              <Route path="/learn/:courseId" element={<PremiumLearningExperience />} />
              <Route path="/learn/:courseId/:lessonId" element={<PremiumLearningExperience />} />
            </Route>

            {/* ââââ Admin routes ââââ */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={null} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/new" element={<AdminCourseEditor />} />
                <Route path="courses/:courseId/edit" element={<AdminCourseEditor />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="webinars" element={<AdminWebinars />} />
                <Route path="webinars/new" element={<AdminWebinars />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* ââââ Site Builder ââââ */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin', 'marketing_admin', 'instructor']} />}>
              <Route path="/admin/site-builder" element={<SiteBuilder />} />
              <Route path="/admin/site-builder/:pageId" element={<SiteBuilder />} />
            </Route>

            {/* ââââ Community ââââ */}
            <Route path="/community/post/:postId" element={<CommunityApp />} />
            <Route path="/community/*" element={<CommunityApp />} />

            {/* ââââ Webinars ââââ */}
            <Route path="/webinars/*" element={<WebinarSystem />} />

            {/* ââââ Auth routes ââââ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </SupabaseAuthProvider>
  );
};

export default App;