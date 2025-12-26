import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Palette } from 'lucide-react'

const THEME_OPTIONS = [
  {
    name: 'Yellow',
    value: '#FFE400',
    label: 'Yellow Theme',
    description: 'Bright and energetic yellow background',
  },
  {
    name: 'Red',
    value: '#FF0000',
    label: 'Red Theme',
    description: 'Bold and vibrant red background',
  },
  {
    name: 'Blue',
    value: '#0000FF',
    label: 'Blue Theme',
    description: 'Classic and professional blue background',
  },
]

export default function CMSColorsPage() {
  const [selectedTheme, setSelectedTheme] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      setLoading(true)
      const settings = await api.getCMSSettings()
      const currentTheme = settings?.branding_background_color || 
                           settings?.theme_background_color || 
                           localStorage.getItem('branding_background_color') ||
                           ''
      setSelectedTheme(currentTheme)
      if (currentTheme) {
        applyTheme(currentTheme)
      }
    } catch (error: any) {
      // Try loading from localStorage as fallback
      const savedTheme = localStorage.getItem('branding_background_color')
      if (savedTheme) {
        setSelectedTheme(savedTheme)
        applyTheme(savedTheme)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleThemeSelect = async (themeValue: string) => {
    console.log('Theme selected:', themeValue)
    setSelectedTheme(themeValue)
    
    // Apply theme immediately (before saving)
    applyTheme(themeValue)
    
    // Auto-save when selecting
    try {
      setSaving(true)
      setMessage(null)
      const result = await api.updateCMSSetting('branding_background_color', themeValue, 'color', 'branding')
      console.log('Theme saved to database:', result)
      setMessage({ type: 'success', text: 'Theme color updated successfully! Refreshing page...' })
      
      // Refresh the page after a short delay to apply changes to all sections
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error('Error saving theme:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save theme' })
      setSaving(false)
    }
  }

  const applyTheme = (color: string) => {
    if (typeof document !== 'undefined') {
      console.log('Applying theme color:', color)
      // Apply as CSS variable
      document.documentElement.style.setProperty('--branding-background', color)
      
      // Apply to html element background for immediate effect with !important
      document.documentElement.style.setProperty('background-color', color, 'important')
      document.documentElement.style.backgroundColor = color
      
      // Store in localStorage for persistence
      localStorage.setItem('branding_background_color', color)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('themeColorChanged', { detail: { color } }))
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Palette className="w-8 h-8" />
            <span>Theme Colors</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose your branding background color - changes apply instantly
          </p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      {saving && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Saving theme...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = selectedTheme === theme.value
          
          return (
            <motion.div
              key={theme.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeSelect(theme.value)}
              className={`
                relative cursor-pointer rounded-2xl p-8 shadow-xl border-2 transition-all duration-300
                ${isSelected
                  ? 'border-primary-600 dark:border-primary-400 ring-4 ring-primary-200 dark:ring-primary-800 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20'
                  : 'border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-slate-800'
                }
              `}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-primary-600 dark:bg-primary-400 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Color Preview */}
              <div
                className="w-full h-32 rounded-xl mb-4 shadow-lg border-2 border-gray-200 dark:border-slate-600"
                style={{ backgroundColor: theme.value }}
              />

              {/* Theme Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {theme.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {theme.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100">
                    {theme.value}
                  </code>
                </div>
              </div>

              {/* Click indicator */}
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isSelected ? '✓ Active Theme' : 'Click to apply'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Current Theme Display */}
      {selectedTheme && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white via-primary-50/30 to-ocean-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl p-6 shadow-xl border border-primary-200/50 dark:border-primary-800/50"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Current Theme
          </h3>
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-lg shadow-lg border-2 border-gray-200 dark:border-slate-600"
              style={{ backgroundColor: selectedTheme }}
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {THEME_OPTIONS.find(t => t.value === selectedTheme)?.label || 'Custom Theme'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {selectedTheme}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
