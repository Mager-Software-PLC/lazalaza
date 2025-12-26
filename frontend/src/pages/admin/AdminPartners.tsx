import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Edit, Users, Upload, X, Image as ImageIcon, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    order_index: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const data = await api.getAllPartners()
      setPartners(data)
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      description: '',
      order_index: partners.length,
      is_active: true,
    })
    setSelectedPartner(null)
    setShowCreateModal(true)
  }

  const handleEdit = (partner: any) => {
    setSelectedPartner(partner)
    setFormData({
      name: partner.name || '',
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      description: partner.description || '',
      order_index: partner.order_index || 0,
      is_active: partner.is_active !== undefined ? partner.is_active : true,
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
      const media = await api.uploadMedia(file, `Partner: ${formData.name || 'New Partner'}`, 'Partner logo', 'partners')
      if (media && media.file_path) {
        setFormData({ ...formData, logo_url: media.file_path })
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
      if (showEditModal && selectedPartner) {
        await api.updatePartner(selectedPartner.id, formData)
      } else {
        await api.createPartner(formData)
      }

      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedPartner(null)
      fetchPartners()
    } catch (error: any) {
      alert(error.message || 'Failed to save partner')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    try {
      await api.deletePartner(id)
      fetchPartners()
    } catch (error) {
      alert('Failed to delete partner')
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const partnerIndex = partners.findIndex(p => p.id === id)
    if (partnerIndex === -1) return

    const newIndex = direction === 'up' ? partnerIndex - 1 : partnerIndex + 1
    if (newIndex < 0 || newIndex >= partners.length) return

    const updatedPartners = [...partners]
    const [removed] = updatedPartners.splice(partnerIndex, 1)
    updatedPartners.splice(newIndex, 0, removed)

    const reorderData = updatedPartners.map((p, i) => ({
      id: p.id,
      order_index: i,
    }))

    try {
      await api.reorderPartners(reorderData)
      fetchPartners()
    } catch (error) {
      alert('Failed to reorder partners')
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
            <Users className="w-8 h-8" />
            <span>Partner Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage partners displayed on the home page</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Partner</span>
        </motion.button>
      </div>

      <div className="grid gap-6">
        {partners.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No partners yet. Add your first partner!</p>
          </div>
        ) : (
          partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReorder(partner.id, 'up')}
                    disabled={partners.findIndex(p => p.id === partner.id) === 0}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReorder(partner.id, 'down')}
                    disabled={partners.findIndex(p => p.id === partner.id) === partners.length - 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-primary-200 dark:border-primary-800">
                  {partner.logo_url ? (
                    <img src={getImageUrl(partner.logo_url)} alt={partner.name} className="w-full h-full object-contain" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{partner.name}</h3>
                  {partner.website_url && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 truncate">{partner.website_url}</p>
                  )}
                  {partner.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{partner.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${partner.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {partner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(partner)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(partner.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Partner</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  {formData.logo_url && (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border-2 border-primary-200 dark:border-primary-800">
                      <img src={getImageUrl(formData.logo_url)} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center space-x-2"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span>{formData.logo_url ? 'Change Logo' : 'Upload Logo'}</span>
                          </>
                        )}
                      </motion.div>
                    </label>
                    {formData.logo_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600"
                >
                  Create Partner
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Partner</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  {formData.logo_url && (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border-2 border-primary-200 dark:border-primary-800">
                      <img src={getImageUrl(formData.logo_url)} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center space-x-2"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span>{formData.logo_url ? 'Change Logo' : 'Upload Logo'}</span>
                          </>
                        )}
                      </motion.div>
                    </label>
                    {formData.logo_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600"
                >
                  Update Partner
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

