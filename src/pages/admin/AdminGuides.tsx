import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Edit, Users, Upload, X, Image as ImageIcon, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminGuides() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    image: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    youtube_url: '',
    order_index: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const data = await api.adminRequest('/guides/all')
      setGuides(data)
    } catch (error) {
      console.error('Failed to fetch guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      image: '',
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      linkedin_url: '',
      youtube_url: '',
      order_index: guides.length,
      is_active: true,
    })
    setSelectedGuide(null)
    setShowCreateModal(true)
  }

  const handleEdit = (guide: any) => {
    setSelectedGuide(guide)
    setFormData({
      name: guide.name || '',
      title: guide.title || '',
      bio: guide.bio || '',
      image: guide.image || '',
      facebook_url: guide.facebook_url || '',
      instagram_url: guide.instagram_url || '',
      twitter_url: guide.twitter_url || '',
      linkedin_url: guide.linkedin_url || '',
      youtube_url: guide.youtube_url || '',
      order_index: guide.order_index || 0,
      is_active: guide.is_active !== undefined ? guide.is_active : true,
    })
    setShowEditModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      setUploadingImage(true)
      const media = await api.uploadMedia(file, `Guide: ${formData.name || 'New Guide'}`, 'Guide profile image', 'guides')
      if (media && media.file_path) {
        setFormData({ ...formData, image: media.file_path })
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (showEditModal && selectedGuide) {
        await api.adminRequest(`/guides/${selectedGuide.id}`, {
          method: 'PUT',
          body: formData,
        })
      } else {
        await api.adminRequest('/guides', {
          method: 'POST',
          body: formData,
        })
      }
      
      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedGuide(null)
      fetchGuides()
    } catch (error: any) {
      alert(error.message || 'Failed to save guide')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guide?')) return

    try {
      await api.adminRequest(`/guides/${id}`, { method: 'DELETE' })
      fetchGuides()
    } catch (error) {
      alert('Failed to delete guide')
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const guideIndex = guides.findIndex(g => g.id === id)
    if (guideIndex === -1) return

    const newIndex = direction === 'up' ? guideIndex - 1 : guideIndex + 1
    if (newIndex < 0 || newIndex >= guides.length) return

    const updatedGuides = [...guides]
    const [removed] = updatedGuides.splice(guideIndex, 1)
    updatedGuides.splice(newIndex, 0, removed)

    const reorderData = updatedGuides.map((g, i) => ({
      id: g.id,
      order_index: i,
    }))

    try {
      await api.adminRequest('/guides/reorder', {
        method: 'PUT',
        body: { guides: reorderData },
      })
      fetchGuides()
    } catch (error) {
      alert('Failed to reorder guides')
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Guides Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your Service guides</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Guide</span>
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-white via-primary-50/30 to-ocean-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-xl border ${
              !guide.is_active ? 'border-2 border-gray-300 opacity-60' : 'border-primary-200/50 dark:border-primary-800/50'
            } hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReorder(guide.id, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReorder(guide.id, 'down')}
                  disabled={index === guides.length - 1}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(guide)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-600 dark:text-primary-400 transition-colors"
                  title="Edit guide"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(guide.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                  title="Delete guide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center mb-4">
              {guide.image ? (
                <img
                  src={getImageUrl(guide.image)}
                  alt={guide.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary-200 dark:border-primary-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-primary-400 to-ocean-400 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800">
                  <Users className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-center mb-1 text-gray-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 text-center mb-3 font-semibold">
              {guide.title}
            </p>
            {guide.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-3 mb-3">
                {guide.bio}
              </p>
            )}
            
            {/* Social Media Indicators */}
            {(guide.facebook_url || guide.instagram_url || guide.twitter_url || guide.linkedin_url || guide.youtube_url) && (
              <div className="flex items-center justify-center space-x-1 mt-2">
                {guide.facebook_url && (
                  <div className="w-2 h-2 rounded-full bg-blue-600" title="Facebook" />
                )}
                {guide.instagram_url && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" title="Instagram" />
                )}
                {guide.twitter_url && (
                  <div className="w-2 h-2 rounded-full bg-black dark:bg-gray-600" title="Twitter/X" />
                )}
                {guide.linkedin_url && (
                  <div className="w-2 h-2 rounded-full bg-blue-700" title="LinkedIn" />
                )}
                {guide.youtube_url && (
                  <div className="w-2 h-2 rounded-full bg-red-600" title="YouTube" />
                )}
              </div>
            )}
            
            {!guide.is_active && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Inactive</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {showEditModal ? 'Edit Guide' : 'Add New Guide'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setSelectedGuide(null)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder="Guide name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Expert Service Guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder="Guide biography and experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Image
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
                            <Upload className="w-5 h-5" />
                            <span>Upload Image</span>
                          </div>
                        )}
                      </div>
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Guide preview"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-slate-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Social Media Links
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formData.facebook_url}
                      onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://youtube.com/@username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  {showEditModal ? 'Update Guide' : 'Create Guide'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedGuide(null)
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

