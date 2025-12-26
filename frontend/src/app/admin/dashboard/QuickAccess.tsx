import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, FileText, Palette, Image, Settings, ToggleLeft, ArrowRight,
  Calendar, MessageSquare, Users, Layout, Navigation
} from 'lucide-react'

export default function QuickAccess() {
  const menuItems = [
    {
      category: 'Management',
      items: [
        { href: '/admin/Services', label: 'Services', icon: MapPin, description: 'Manage services and packages', gradient: 'from-primary-500 to-ocean-500', bg: 'from-primary-50 to-ocean-50 dark:from-primary-900/20 dark:to-ocean-900/20', border: 'border-primary-200 dark:border-primary-800', hover: 'group-hover:text-primary-600 dark:group-hover:text-primary-400' },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar, description: 'View and manage bookings', gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', hover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' },
        { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Approve and manage reviews', gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20', border: 'border-purple-200 dark:border-purple-800', hover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400' },
        { href: '/admin/contacts', label: 'Contacts', icon: Users, description: 'View contact messages', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20', border: 'border-blue-200 dark:border-blue-800', hover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
      ]
    },
    {
      category: 'Content Management',
      items: [
        { href: '/admin/cms', label: 'Content Manager', icon: FileText, description: 'Edit all text content', gradient: 'from-indigo-500 to-purple-500', bg: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20', border: 'border-indigo-200 dark:border-indigo-800', hover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' },
        { href: '/admin/cms/media', label: 'Media Library', icon: Image, description: 'Upload and manage media', gradient: 'from-rose-500 to-pink-500', bg: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20', border: 'border-rose-200 dark:border-rose-800', hover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400' },
        { href: '/admin/cms/gallery', label: 'Gallery', icon: Image, description: 'Manage gallery images', gradient: 'from-violet-500 to-purple-500', bg: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20', border: 'border-violet-200 dark:border-violet-800', hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400' },
      ]
    },
    {
      category: 'Customization',
      items: [
        { href: '/admin/cms/colors', label: 'Theme Colors', icon: Palette, description: 'Choose branding background color (Yellow, Red, or Blue)', gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', hover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400' },
        { href: '/admin/cms/sections', label: 'Section Order', icon: Layout, description: 'Reorder and show/hide sections', gradient: 'from-blue-500 to-indigo-500', bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20', border: 'border-blue-200 dark:border-blue-800', hover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
        { href: '/admin/cms/navbar', label: 'Navbar Management', icon: Navigation, description: 'Add, edit, and reorder navbar links', gradient: 'from-cyan-500 to-blue-500', bg: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20', border: 'border-cyan-200 dark:border-cyan-800', hover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' },
        { href: '/admin/cms/settings', label: 'Site Settings', icon: Settings, description: 'Configure site options', gradient: 'from-slate-500 to-gray-500', bg: 'from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800', border: 'border-slate-200 dark:border-slate-700', hover: 'group-hover:text-slate-600 dark:group-hover:text-slate-400' },
        { href: '/admin/cms/features', label: 'Features', icon: ToggleLeft, description: 'Enable/disable features', gradient: 'from-teal-500 to-cyan-500', bg: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20', border: 'border-teal-200 dark:border-teal-800', hover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400' },
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Access</h3>
      
      {menuItems.map((category, categoryIndex) => (
        <div key={category.category} className={categoryIndex < menuItems.length - 1 ? 'mb-8' : ''}>
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            {category.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} to={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 bg-gradient-to-br ${item.bg} rounded-xl border ${item.border} cursor-pointer group`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-br ${item.gradient} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-gray-900 dark:text-white ${item.hover} transition-colors`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-gray-400 ${item.hover} transition-colors`} />
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

