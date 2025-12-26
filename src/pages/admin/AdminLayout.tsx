import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, MapPin, Calendar, MessageSquare, Users, LogOut, Menu, X, Settings, Palette, FileText, Image, ToggleLeft, Home, Video, UserCircle, Award, Layout, Sparkles, Navigation, Key } from 'lucide-react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [admin, setAdmin] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [brandingColor, setBrandingColor] = useState<string | null>(null)

  // Check for branding color and listen for changes
  useEffect(() => {
    const checkBrandingColor = () => {
      const color = typeof window !== 'undefined' ? localStorage.getItem('branding_background_color') : null
      setBrandingColor(color)
    }
    
    checkBrandingColor()
    
    const handleBrandingChange = () => {
      checkBrandingColor()
    }
    
    window.addEventListener('brandingColorChanged' as any, handleBrandingChange as EventListener)
    window.addEventListener('themeColorChanged' as any, handleBrandingChange as EventListener)
    
    return () => {
      window.removeEventListener('brandingColorChanged' as any, handleBrandingChange as EventListener)
      window.removeEventListener('themeColorChanged' as any, handleBrandingChange as EventListener)
    }
  }, [])
  
  // Check if desktop and always show sidebar on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      if (desktop) {
        setSidebarOpen(true) // Always open on desktop
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/admin/login') {
      return
    }

    const token = localStorage.getItem('admin_token')
    const adminData = localStorage.getItem('admin_user')

    if (!token || !adminData) {
      navigate('/admin/login')
      return
    }

    setAdmin(JSON.parse(adminData))
  }, [navigate, pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    // Dispatch custom event to update navbar
    window.dispatchEvent(new Event('admin-logout'))
    navigate('/admin/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/tours', label: 'Services', icon: MapPin },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { href: '/admin/guides', label: 'Guides', icon: UserCircle },
    { href: '/admin/videos', label: 'Videos', icon: Video },
    { href: '/admin/partners', label: 'Partners', icon: Users },
    { href: '/admin/contacts', label: 'Contacts', icon: Users },
    { href: '/admin/achievements', label: 'Our Achievements', icon: Award },
    { href: '/admin/cms', label: 'Content Manager', icon: FileText },
    { href: '/admin/cms/hero', label: 'Hero Settings', icon: Video },
    { href: '/admin/cms/logo', label: 'Logo Settings', icon: Image },
    { href: '/admin/cms/colors', label: 'Theme Colors', icon: Palette },
    { href: '/admin/cms/sections', label: 'Section Order', icon: Layout },
    { href: '/admin/cms/navbar', label: 'Navbar Management', icon: Navigation },
    { href: '/admin/cms/media', label: 'Media Library', icon: Image },
    { href: '/admin/cms/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/cms/settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/cms/features', label: 'Features', icon: ToggleLeft },
    { href: '/admin/users', label: 'Admin Users', icon: Users },
    { href: '/admin/change-password', label: 'Change Password', icon: Key },
  ]

  // Don't render layout for login page (handled by separate route)
  if (pathname === '/admin/login') {
    return null
  }

  if (!mounted || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const adminBgClass = brandingColor ? 'bg-transparent' : 'bg-gradient-to-br from-gray-50 via-primary-50/30 to-ocean-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'

  return (
    <div className={`min-h-screen ${adminBgClass}`}>
      {/* Mobile Sidebar Toggle */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${brandingColor ? 'bg-white/95 dark:bg-slate-800/95' : 'bg-gradient-to-r from-white/95 via-primary-50/95 to-white/95 dark:from-slate-800/95 dark:via-slate-900/95 dark:to-slate-800/95'} backdrop-blur-md border-b border-primary-200/50 dark:border-primary-800/50 shadow-lg p-4 flex items-center justify-between`}>
        <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">Laza International Admin</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-ocean-100 dark:from-slate-700 dark:to-slate-600 hover:from-primary-200 hover:to-ocean-200 transition-all shadow-md"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-primary-600 dark:text-primary-400" /> : <Menu className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            x: isDesktop ? 0 : (sidebarOpen ? 0 : -300)
          }}
          transition={{ type: 'tween', duration: 0.3 }}
          className={`fixed lg:fixed inset-y-0 left-0 z-40 w-64 ${brandingColor ? 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md' : 'bg-gradient-to-b from-white via-primary-50/50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800'} border-r border-primary-200/50 dark:border-primary-800/50 pt-16 lg:pt-0 shadow-xl`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-primary-200/50 dark:border-primary-800/50 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-accent-500/10">
              <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">Laza International Admin</h2>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-ocean-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {admin.username}
                </p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto overscroll-contain">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md mb-4 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Return to Home</span>
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-accent-500/20 text-primary-700 dark:text-primary-300 shadow-md border-l-4 border-primary-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:via-purple-50 hover:to-accent-50 dark:hover:from-slate-700 dark:hover:to-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700 w-full transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

