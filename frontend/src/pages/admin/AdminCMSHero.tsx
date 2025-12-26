import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Video, Upload, X, Image as ImageIcon } from 'lucide-react'

export default function CMSHeroPage() {
  const [heroData, setHeroData] = useState<any>({
    title: '',
    subtitle: '',
    description: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
    background_video: '',
    background_image: '',
    overlay_opacity: 0.4,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadHeroSettings()
  }, [])

  const loadHeroSettings = async () => {
    try {
      setLoading(true)
      const data = await api.getCMSHero()
      if (data) {
        setHeroData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          primary_button_text: data.primary_button_text || '',
          primary_button_link: data.primary_button_link || '',
          secondary_button_text: data.secondary_button_text || '',
          secondary_button_link: data.secondary_button_link || '',
          background_video: data.background_video || '',
          background_image: data.background_image || '',
          overlay_opacity: data.overlay_opacity || 0.4,
        })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Please select a video file' })
      return
    }

    try {
      setUploadingVideo(true)
      setMessage(null)
      const media = await api.uploadMedia(file, 'Hero background video', 'Hero section background video', 'hero')
      if (media && media.file_path) {
        setHeroData({ ...heroData, background_video: media.file_path })
        setMessage({ type: 'success', text: 'Video uploaded successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload video' })
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    try {
      setUploadingImage(true)
      setMessage(null)
      const media = await api.uploadMedia(file, 'Hero background image', 'Hero section background image', 'hero')
      if (media && media.file_path) {
        setHeroData({ ...heroData, background_image: media.file_path })
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' })
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      await api.updateCMSHero(heroData)
      setMessage({ type: 'success', text: 'Hero settings saved successfully!' })
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

  const getVideoUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
    return `${baseUrl}${path}`
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
            <Video className="w-8 h-8" />
            <span>Hero Settings</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your hero section</p>
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
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Text Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Experience the Majesty of Niagara Falls"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Small group and private Services designed for unforgettable memories"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Additional description text"
              />
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Buttons
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={heroData.primary_button_text}
                onChange={(e) => setHeroData({ ...heroData, primary_button_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Book Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Link
              </label>
              <input
                type="text"
                value={heroData.primary_button_link}
                onChange={(e) => setHeroData({ ...heroData, primary_button_link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="/book"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={heroData.secondary_button_text}
                onChange={(e) => setHeroData({ ...heroData, secondary_button_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="View Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Button Link
              </label>
              <input
                type="text"
                value={heroData.secondary_button_link}
                onChange={(e) => setHeroData({ ...heroData, secondary_button_link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="/Services"
              />
            </div>
          </div>
        </motion.div>

        {/* Background Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Background Media
          </h2>
          <div className="space-y-4">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Video
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-primary-500 transition-colors">
                      {uploadingVideo ? (
                        <div className="flex items-center space-x-2 text-primary-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Upload className="w-5 h-5" />
                          <span>Upload Video</span>
                        </div>
                      )}
                    </div>
                  </label>
                  {heroData.background_video && (
                    <button
                      onClick={() => setHeroData({ ...heroData, background_video: '' })}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove video"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {heroData.background_video && (
                  <div className="mt-2">
                    <video
                      src={getVideoUrl(heroData.background_video)}
                      className="w-full max-w-md rounded-lg border border-gray-200 dark:border-slate-700"
                      controls
                      muted
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Current video: {heroData.background_video}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Image (Alternative)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-primary-500 transition-colors">
                      {uploadingImage ? (
                        <div className="flex items-center space-x-2 text-primary-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                          <span>Upload Image</span>
                        </div>
                      )}
                    </div>
                  </label>
                  {heroData.background_image && (
                    <button
                      onClick={() => setHeroData({ ...heroData, background_image: '' })}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {heroData.background_image && (
                  <div className="mt-2">
                    <img
                      src={getImageUrl(heroData.background_image)}
                      alt="Hero background"
                      className="w-full max-w-md rounded-lg border border-gray-200 dark:border-slate-700"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Current image: {heroData.background_image}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Overlay Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overlay Opacity: {heroData.overlay_opacity}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={heroData.overlay_opacity}
                onChange={(e) => setHeroData({ ...heroData, overlay_opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

