import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

export default function CMSLogoPage() {
  const [logoData, setLogoData] = useState({
    logo_image: '',
    logo_zoom: 1.0,
    brand_name: '',
    show_brand_name: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [zoom, setZoom] = useState(1.0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadLogoSettings()
  }, [])

  const loadLogoSettings = async () => {
    try {
      setLoading(true)
      const settings = await api.getCMSSettings()
      setLogoData({
        logo_image: settings.logo_image || '',
        logo_zoom: parseFloat(settings.logo_zoom) || 1.0,
        brand_name: settings.brand_name || '',
        show_brand_name: settings.show_brand_name !== 'false' && settings.show_brand_name !== false,
      })
      setZoom(parseFloat(settings.logo_zoom) || 1.0)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    try {
      setUploading(true)
      setMessage(null)
      const media = await api.uploadMedia(file, 'Site logo', 'Company logo image', 'logo')
      if (media && media.file_path) {
        setLogoData({ ...logoData, logo_image: media.file_path })
        setMessage({ type: 'success', text: 'Logo uploaded successfully!' })
        setTimeout(() => setMessage(null), 3000)
        // Reset zoom and position when new image is uploaded
        setZoom(1.0)
        setPosition({ x: 0, y: 0 })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload logo' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 3.0)
    setZoom(newZoom)
    setLogoData({ ...logoData, logo_zoom: newZoom })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5)
    setZoom(newZoom)
    setLogoData({ ...logoData, logo_zoom: newZoom })
  }

  const handleReset = () => {
    setZoom(1.0)
    setPosition({ x: 0, y: 0 })
    setLogoData({ ...logoData, logo_zoom: 1.0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!logoData.logo_image) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !logoData.logo_image) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      await api.updateCMSSettings({
        logo_image: logoData.logo_image,
        logo_zoom: logoData.logo_zoom.toString(),
        brand_name: logoData.brand_name,
        show_brand_name: logoData.show_brand_name.toString(),
      })
      setMessage({ type: 'success', text: 'Logo settings saved successfully!' })
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
            <span>Logo Settings</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and configure your company logo</p>
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Logo Upload and Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Logo Image
          </h2>
          
          {/* Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Logo
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-primary-500 transition-colors">
                  {uploading ? (
                    <div className="flex items-center space-x-2 text-primary-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Upload className="w-5 h-5" />
                      <span>Upload Logo</span>
                    </div>
                  )}
                </div>
              </label>
              {logoData.logo_image && (
                <button
                  onClick={() => {
                    setLogoData({ ...logoData, logo_image: '' })
                    setZoom(1.0)
                    setPosition({ x: 0, y: 0 })
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove logo"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Zoom Controls */}
          {logoData.logo_image && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zoom Controls
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value)
                  setZoom(newZoom)
                  setLogoData({ ...logoData, logo_zoom: newZoom })
                }}
                className="w-full mt-2"
              />
            </div>
          )}

          {/* Logo Preview with Zoom */}
          {logoData.logo_image && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview (Click and drag to reposition)
              </label>
              <div
                ref={containerRef}
                className="relative w-full h-64 border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  ref={imageRef}
                  className="absolute inset-0 flex items-center justify-center cursor-move"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <img
                    src={getImageUrl(logoData.logo_image)}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Brand Name Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Brand Name
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={logoData.show_brand_name}
                  onChange={(e) => setLogoData({ ...logoData, show_brand_name: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Show brand name below logo
                </span>
              </label>
            </div>

            {logoData.show_brand_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={logoData.brand_name}
                  onChange={(e) => setLogoData({ ...logoData, brand_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder="YEHA Services"
                />
              </div>
            )}

            {/* Final Preview */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Final Preview
              </label>
              <div className="border-2 border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center space-y-2">
                  {logoData.logo_image ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={getImageUrl(logoData.logo_image)}
                        alt="Logo"
                        className="max-h-20 object-contain"
                        style={{
                          transform: `scale(${logoData.logo_zoom})`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-20 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {logoData.show_brand_name && logoData.brand_name && (
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {logoData.brand_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

