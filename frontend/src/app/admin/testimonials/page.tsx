import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Trash2, Check, X, Plus, Edit, MessageSquare, Upload, Image as ImageIcon } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    rating: 5,
    comment: '',
    image_url: '',
    approved: true,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      // Fetch all testimonials (both approved and unapproved) for admin
      const data = await api.adminRequest('/testimonials/all')
      setTestimonials(data)
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${path}`
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
      const media = await api.uploadMedia(file, formData.name || 'Testimonial Image', '', 'testimonials')
      if (media && media.file_path) {
        setFormData({ ...formData, image_url: media.file_path })
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      location: '',
      rating: 5,
      comment: '',
      image_url: '',
      approved: true,
    })
    setShowCreateModal(true)
  }

  const handleEdit = (testimonial: any) => {
    setSelectedTestimonial(testimonial)
    setFormData({
      name: testimonial.name || '',
      email: testimonial.email || '',
      location: testimonial.location || '',
      rating: testimonial.rating || 5,
      comment: testimonial.comment || '',
      image_url: testimonial.image_url || '',
      approved: testimonial.approved !== undefined ? testimonial.approved : true,
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (showEditModal && selectedTestimonial) {
        await api.adminRequest(`/testimonials/${selectedTestimonial.id}`, {
          method: 'PUT',
          body: formData,
        })
      } else {
        // Create testimonial - can use public endpoint
        await api.createTestimonial(formData)
      }
      
      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedTestimonial(null)
      fetchTestimonials()
    } catch (error: any) {
      alert(error.message || 'Failed to save testimonial')
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await api.adminRequest(`/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approved: true }),
      })
      fetchTestimonials()
    } catch (error) {
      // Error handled silently
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      await api.adminRequest(`/testimonials/${id}`, { method: 'DELETE' })
      fetchTestimonials()
    } catch (error) {
      // Error handled silently
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Testimonials Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage guest reviews and testimonials</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Testimonial</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-xl border ${
                !testimonial.approved ? 'border-2 border-yellow-400 shadow-yellow-200/50' : 'border-primary-200/50 dark:border-primary-800/50'
              } hover:shadow-2xl transition-all duration-300`}
            >
              {testimonial.image_url && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(testimonial.image_url)}
                    alt={testimonial.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                {!testimonial.approved && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-md">
                    Pending
                  </span>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.comment}"
              </p>

              <div className="mb-4">
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                {testimonial.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-ocean-500 hover:from-primary-600 hover:to-ocean-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                {!testimonial.approved && (
                  <button
                    onClick={() => handleApprove(testimonial.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No testimonials yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Create your first testimonial to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {showEditModal ? 'Edit Testimonial' : 'Create New Testimonial'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setSelectedTestimonial(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Toronto, Canada"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <select
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment/Review *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image
                </label>
                <div className="space-y-4">
                  {formData.image_url && (
                    <div className="relative">
                      <img
                        src={getImageUrl(formData.image_url)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-slate-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="approved"
                  checked={formData.approved}
                  onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="approved" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Approved (visible on website)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedTestimonial(null)
                    setFormData({
                      name: '',
                      email: '',
                      location: '',
                      rating: 5,
                      comment: '',
                      image_url: '',
                      approved: true,
                    })
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-2xl"
                >
                  {showEditModal ? 'Update Testimonial' : 'Create Testimonial'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

