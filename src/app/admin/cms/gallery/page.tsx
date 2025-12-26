import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { ImageIcon, Loader2, X, Trash2, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Plus } from 'lucide-react'

export default function CMSGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [allMedia, setAllMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [gallery, media] = await Promise.all([
        api.getGalleryManage(),
        api.getMedia(),
      ])
      setGalleryItems(gallery || [])
      setAllMedia(media || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToGallery = async (mediaId: number) => {
    try {
      setSaving(true)
      setMessage(null)
      await api.addToGallery(mediaId)
      setMessage({ type: 'success', text: 'Added to gallery!' })
      setShowAddModal(false)
      loadData()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id: number) => {
    if (!confirm('Remove this image from gallery?')) return

    try {
      setSaving(true)
      setMessage(null)
      await api.removeFromGallery(id)
      setMessage({ type: 'success', text: 'Removed from gallery!' })
      loadData()
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newItems = [...galleryItems]
    const temp = newItems[index].order_index
    newItems[index].order_index = newItems[index - 1].order_index
    newItems[index - 1].order_index = temp
    setGalleryItems(newItems)
    await saveOrder(newItems)
  }

  const handleMoveDown = async (index: number) => {
    if (index === galleryItems.length - 1) return
    const newItems = [...galleryItems]
    const temp = newItems[index].order_index
    newItems[index].order_index = newItems[index + 1].order_index
    newItems[index + 1].order_index = temp
    setGalleryItems(newItems)
    await saveOrder(newItems)
  }

  const saveOrder = async (items: any[]) => {
    try {
      setSaving(true)
      const orderData = items.map((item, idx) => ({
        id: item.id,
        order_index: idx,
      }))
      await api.reorderGallery(orderData)
      setMessage({ type: 'success', text: 'Order saved!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
      loadData() // Reload on error
    } finally {
      setSaving(false)
    }
  }

  const getFileUrl = (filePath: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    return `${API_URL.replace('/api', '')}${filePath}`
  }

  const availableMedia = allMedia.filter(
    (media) => !galleryItems.some((item) => item.media_id === media.id && item.is_active)
  )

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
            <span>Gallery Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage gallery images and their order</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Image</span>
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

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Add Image to Gallery
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {availableMedia.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No available images. Upload some images first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableMedia
                    .filter((media) => media.file_type?.startsWith('image/'))
                    .map((media) => (
                      <motion.div
                        key={media.id}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handleAddToGallery(media.id)}
                      >
                        <img
                          src={getFileUrl(media.file_path)}
                          alt={media.alt_text || media.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryItems
          .sort((a, b) => a.order_index - b.order_index)
          .map((item, index) => {
            const media = item.media || allMedia.find((m) => m.id === item.media_id)
            if (!media) return null

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 group relative"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
                  {media.file_type?.startsWith('image/') ? (
                    <img
                      src={getFileUrl(media.file_path)}
                      alt={media.alt_text || media.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || saving}
                      className="p-2 bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === galleryItems.length - 1 || saving}
                      className="p-2 bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={saving}
                      className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    #{index + 1}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {media.alt_text || media.filename}
                  </p>
                </div>
              </motion.div>
            )
          })}
      </div>

      {galleryItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No images in gallery yet. Add your first image!</p>
        </div>
      )}
    </div>
  )
}

