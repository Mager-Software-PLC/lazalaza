import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

  // Ensure form is always shown - don't auto-login
  useEffect(() => {
    // Reset form state to ensure fresh login
    setFormData({ username: '', password: '' })
    setError('')
    setLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate that both fields are filled
    if (!formData.username.trim()) {
      setError('Username is required')
      return
    }
    
    if (!formData.password.trim()) {
      setError('Password is required')
      return
    }
    
    setLoading(true)

    try {
      const response = await api.adminLogin(formData.username.trim(), formData.password)
      localStorage.setItem('admin_token', response.token)
      localStorage.setItem('admin_user', JSON.stringify(response.admin))
      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('admin-login'))
      navigate('/admin/dashboard')
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed'
      if (errorMessage.includes('Cannot connect') || errorMessage.includes('Failed to fetch')) {
        const isProduction = !window.location.hostname.includes('localhost')
        if (isProduction) {
          setError(`Cannot connect to backend. Please check VITE_API_URL and rebuild. ${errorMessage.includes('Current API URL') ? errorMessage.split('Current API URL:')[1] : ''}`)
        } else {
          setError('Backend server is not running. Please start it with: npm run server')
        }
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const loginBgClass = brandingColor ? 'bg-transparent' : 'bg-gradient-to-br from-primary-500 via-purple-600 to-accent-600'

  return (
    <div className={`min-h-screen flex items-center justify-center ${loginBgClass} p-4 relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ocean-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold font-display mb-2 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Laza Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
              <input
                type="text"
                id="username"
                name="username"
                required
                autoComplete="off"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="off"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-400/50 dark:border-red-600/50 text-red-800 dark:text-red-200 rounded-lg text-sm"
            >
              <div className="font-semibold mb-1">⚠️ Connection Error</div>
              <div>{error}</div>
              {error.includes('backend server') && (
                <div className="mt-3 p-3 bg-slate-800 rounded-lg text-xs font-mono text-gray-300">
                  <div className="mb-1">Quick fix:</div>
                  <div className="text-primary-400">1. Open a new terminal</div>
                  <div className="text-primary-400">2. Run: <span className="text-white">npm run server</span></div>
                  <div className="text-primary-400">3. Wait for: "Server running on http://localhost:5000"</div>
                  <div className="text-primary-400">4. Try logging in again</div>
                </div>
              )}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

