import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Settings as SettingsIcon, Upload, X, Image as ImageIcon } from 'lucide-react'

export default function CMSSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await api.getCMSSettings()
      setSettings(data)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    try {
      setUploadingAboutImage(true)
      setMessage(null)
      const media = await api.uploadMedia(file, 'About section image', 'About section image next to hero', 'about')
      if (media && media.file_path) {
        setSettings({ ...settings, about_image: media.file_path })
        setMessage({ type: 'success', text: 'About image uploaded successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' })
    } finally {
      setUploadingAboutImage(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      await api.updateCMSSettings(settings)
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
    return `${baseUrl}${path}`
  }

  const settingCategories = [
    {
      title: 'General Settings',
      keys: ['site_name', 'site_tagline', 'maintenance_mode'],
    },
    {
      title: 'Contact Information',
      keys: ['contact_email', 'contact_phone', 'contact_address'],
    },
    {
      title: 'Social Media',
      keys: ['facebook_url', 'instagram_url', 'twitter_url'],
    },
    {
      title: 'Features',
      keys: ['enable_booking', 'enable_testimonials', 'enable_gallery'],
    },
  ]

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
            <SettingsIcon className="w-8 h-8" />
            <span>Site Settings</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your website settings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </>
          )}
        </motion.button>
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

      <div className="grid gap-6">
        {/* About Section Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            About Section Image
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload About Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutImageUpload}
                    disabled={uploadingAboutImage}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-primary-500 transition-colors">
                    {uploadingAboutImage ? (
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                      </div>
                    )}
                  </div>
                </label>
                {settings.about_image && (
                  <button
                    onClick={() => setSettings({ ...settings, about_image: '' })}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            {settings.about_image && (
              <div className="mt-2">
                <img
                  src={getImageUrl(settings.about_image)}
                  alt="About section"
                  className="w-full max-w-md rounded-lg border border-gray-200 dark:border-slate-700"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current image: {settings.about_image}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {settingCategories.map((category) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {category.title}
            </h2>
            <div className="space-y-4">
              {category.keys.map((key) => {
                const value = settings[key]
                const isBoolean = typeof value === 'boolean' || key.includes('enable') || key.includes('maintenance')
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                    {isBoolean ? (
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value === true || value === 'true'}
                          onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {value === true || value === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

