import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { CMSProvider } from './contexts/CMSContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StickyCTA from './components/StickyCTA'
import CMSColorVariables from './components/CMSColorVariables'
import BrandingBackground from './components/BrandingBackground'

// Public Pages (eagerly loaded)
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ToursPage from './pages/ToursPage'
import TourDetailPage from './pages/TourDetailPage'
import BookPage from './pages/BookPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'

// Admin Pages (lazy loaded for code splitting)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminTours = lazy(() => import('./pages/admin/AdminTours'))
const AdminTourEdit = lazy(() => import('./pages/admin/AdminTourEdit'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'))
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'))
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'))
const AdminGuides = lazy(() => import('./pages/admin/AdminGuides'))
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'))
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'))
const AdminCMSHero = lazy(() => import('./pages/admin/AdminCMSHero'))
const AdminCMSFeatures = lazy(() => import('./pages/admin/AdminCMSFeatures'))
const AdminCMSGallery = lazy(() => import('./pages/admin/AdminCMSGallery'))
const AdminCMSNavbar = lazy(() => import('./pages/admin/AdminCMSNavbar'))
const AdminCMSMedia = lazy(() => import('./pages/admin/AdminCMSMedia'))
const AdminCMSLogo = lazy(() => import('./pages/admin/AdminCMSLogo'))
const AdminCMSSettings = lazy(() => import('./pages/admin/AdminCMSSettings'))
const AdminCMSSections = lazy(() => import('./pages/admin/AdminCMSSections'))
const AdminCMSColors = lazy(() => import('./pages/admin/AdminCMSColors'))
const AdminChangePassword = lazy(() => import('./pages/admin/AdminChangePassword'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <CMSColorVariables />
        <BrandingBackground />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <Home />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <AboutPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/tours" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <ToursPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/tours/:slug" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <TourDetailPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/book" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <BookPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/testimonials" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <TestimonialsPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="min-h-screen">
                  <ContactPage />
                </main>
                <StickyCTA />
                <Footer />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
              </Suspense>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="tours" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminTours />
                </Suspense>
              } />
              <Route path="tours/:id" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminTourEdit />
                </Suspense>
              } />
              <Route path="bookings" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminBookings />
                </Suspense>
              } />
              <Route path="testimonials" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminTestimonials />
                </Suspense>
              } />
              <Route path="contacts" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminContacts />
                </Suspense>
              } />
              <Route path="achievements" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminAchievements />
                </Suspense>
              } />
              <Route path="partners" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPartners />
                </Suspense>
              } />
              <Route path="guides" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminGuides />
                </Suspense>
              } />
              <Route path="videos" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminVideos />
                </Suspense>
              } />
              <Route path="cms" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMS />
                </Suspense>
              } />
              <Route path="cms/hero" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSHero />
                </Suspense>
              } />
              <Route path="cms/features" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSFeatures />
                </Suspense>
              } />
              <Route path="cms/gallery" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSGallery />
                </Suspense>
              } />
              <Route path="cms/navbar" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSNavbar />
                </Suspense>
              } />
              <Route path="cms/media" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSMedia />
                </Suspense>
              } />
              <Route path="cms/logo" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSLogo />
                </Suspense>
              } />
              <Route path="cms/settings" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSSettings />
                </Suspense>
              } />
              <Route path="cms/sections" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSSections />
                </Suspense>
              } />
              <Route path="cms/colors" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCMSColors />
                </Suspense>
              } />
              <Route path="change-password" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminChangePassword />
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminUsers />
                </Suspense>
              } />
            </Route>

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CMSProvider>
    </ThemeProvider>
  )
}

export default App

