import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Upload, Loader2, X, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CMSMediaPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    alt_text: '',
    description: '',
    category: 'general',
  })

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const data = await api.getMedia()
      setMedia(Array.isArray(data) ? data : [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadData.file) {
      setMessage({ type: 'error', text: 'Please select a file' })
      return
    }

    try {
      setUploading(true)
      setMessage(null)
      await api.uploadMedia(uploadData.file, uploadData.alt_text, uploadData.description, uploadData.category)
      setMessage({ type: 'success', text: 'File uploaded successfully!' })
      setUploadData({ file: null, alt_text: '', description: '', category: 'general' })
      setShowUpload(false)
      loadMedia()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      await api.deleteMedia(id)
      setMessage({ type: 'success', text: 'Media deleted successfully!' })
      loadMedia()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const getFileUrl = (filePath: string) => {
    if (!filePath) return ''
    // If it's already a full URL, return it
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath
    }
    // Construct the full URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    const baseUrl = API_URL.replace('/api', '')
    // Ensure filePath starts with /
    const path = filePath.startsWith('/') ? filePath : `/${filePath}`
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
            <ImageIcon className="w-8 h-8" />
            <span>Media Library</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all images and videos</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(!showUpload)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Media</span>
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

      {showUpload && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Upload New Media
            </h2>
            <button
              onClick={() => setShowUpload(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alt Text</label>
              <input
                type="text"
                value={uploadData.alt_text}
                onChange={(e) => setUploadData({ ...uploadData, alt_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Descriptive alt text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="general">General</option>
                <option value="hero">Hero</option>
                <option value="gallery">Gallery</option>
                <option value="Services">Services</option>
                <option value="about">About</option>
              </select>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !uploadData.file}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 group"
          >
            <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
              {item.file_type?.startsWith('image/') ? (
                <>
                  <img
                    src={getFileUrl(item.file_path)}
                    alt={item.alt_text || item.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const placeholder = target.parentElement?.querySelector('.image-error-placeholder') as HTMLElement
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                    onLoad={(e) => {
                      // Hide placeholder when image loads successfully
                      const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector('.image-error-placeholder') as HTMLElement
                      if (placeholder) placeholder.style.display = 'none'
                    }}
                  />
                  <div 
                    className="image-error-placeholder w-full h-full items-center justify-center hidden"
                    style={{ display: 'none' }}
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.filename}</p>
              {item.alt_text && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{item.alt_text}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No media files yet. Upload your first file!</p>
        </div>
      )}
    </div>
  )
}

