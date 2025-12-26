import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Calendar, Users, DollarSign, MessageSquare, TrendingUp, CheckCircle, Clock, XCircle, Star,
  MapPin, FileText, Palette, Image, Settings, ToggleLeft, ArrowRight, LayoutDashboard
} from 'lucide-react'
import { api } from '@/lib/api'
import SimpleChart from '@/components/SimpleChart'
import QuickAccess from './dashboard/QuickAccess'

interface DashboardStats {
  overview: {
    totalBookings: number
    activeServices: number
    totalRevenue: number
    totalMessages: number
    approvedTestimonials: number
  }
  bookingStatus: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number }>
  monthlyBookings: Array<{ month: string; count: number }>
  serviceRevenue: Array<{ service: string; revenue: number; count: number }>
  recentBookings: Array<{
    id: number
    service: string
    guest: string
    date: string
    status: string
    revenue: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // First check if user is authenticated
    const token = localStorage.getItem('admin_token')
    const adminData = localStorage.getItem('admin_user')
    
    if (!token || !adminData) {
      // Redirect to login if not authenticated
      window.location.href = '/admin/login'
      return
    }
    
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (!authChecked) return

    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats()
        setStats(data)
      } catch (error: any) {
        // If token is invalid/expired, the API will clear it and we'll redirect
        if (error.message?.includes('token') || error.message?.includes('Invalid') || error.message?.includes('expired') || error.message?.includes('authentication')) {
          // Small delay to let API clear the token
          setTimeout(() => {
            window.location.href = '/admin/login'
          }, 500)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [authChecked])

  const statCards = stats ? [
    {
      title: 'Total Bookings',
      value: stats.overview.totalBookings,
      icon: Calendar,
      gradient: 'from-primary-500 to-ocean-500',
      bgGradient: 'from-primary-50 to-ocean-50',
      darkBg: 'dark:from-primary-900/20 dark:to-ocean-900/20',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Services',
      value: stats.overview.activeServices,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBg: 'dark:from-emerald-900/20 dark:to-teal-900/20',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.overview.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: 'from-gold-500 to-accent-500',
      bgGradient: 'from-gold-50 to-accent-50',
      darkBg: 'dark:from-gold-900/20 dark:to-accent-900/20',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Messages',
      value: stats.overview.totalMessages,
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBg: 'dark:from-purple-900/20 dark:to-pink-900/20',
    },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!stats && !loading) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please make sure you're logged in and try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-ocean-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-2">
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's your overview</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bgGradient} ${stat.darkBg} dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center space-x-1 text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                {stat.title}
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last 6 months</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <SimpleChart
            data={stats!.monthlyRevenue.map(item => ({
              label: item.month,
              value: item.revenue,
            }))}
            type="line"
            height={200}
          />
        </motion.div>

        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bookings Trend</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last 6 months</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <SimpleChart
            data={stats!.monthlyBookings.map(item => ({
              label: item.month,
              value: item.count,
            }))}
            type="bar"
            height={200}
          />
        </motion.div>
      </div>

      {/* Status Breakdown and Service Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Status</h3>
          <SimpleChart
            data={[
              { label: 'Pending', value: stats!.bookingStatus.pending, color: 'from-yellow-500 to-orange-500' },
              { label: 'Confirmed', value: stats!.bookingStatus.confirmed, color: 'from-blue-500 to-cyan-500' },
              { label: 'Completed', value: stats!.bookingStatus.completed, color: 'from-emerald-500 to-teal-500' },
              { label: 'Cancelled', value: stats!.bookingStatus.cancelled, color: 'from-red-500 to-pink-500' },
            ]}
            type="pie"
            height={200}
          />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats!.bookingStatus.pending}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats!.bookingStatus.confirmed}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats!.bookingStatus.completed}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats!.bookingStatus.cancelled}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue by Service</h3>
          <div className="space-y-4">
            {stats!.serviceRevenue.slice(0, 5).map((service, index) => {
              const maxRevenue = Math.max(...stats!.serviceRevenue.map(s => s.revenue), 1)
              const percentage = (service.revenue / maxRevenue) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                      {service.service}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">
                      ${service.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-primary-500 to-ocean-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{service.count} bookings</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
          <Link to="/admin/bookings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Service</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats!.recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{booking.service}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{booking.guest}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-right text-gray-900 dark:text-white">
                    ${booking.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Access - All Admin Pages */}
      <QuickAccess />
    </div>
  )
}
