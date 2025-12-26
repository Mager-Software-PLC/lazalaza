import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Edit, X, Award, GripVertical, Check, X as XIcon, MapPin, Calendar, Star, Users, Heart, Globe, Trophy, Smile, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'

// Icon mapping
const iconMap: { [key: string]: any } = {
  MapPin,
  Calendar,
  Star,
  Users,
  Award,
  Heart,
  Globe,
  Trophy,
  Smile,
  TrendingUp,
}

const iconOptions = [
  { value: 'MapPin', label: 'Map Pin' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'Star', label: 'Star' },
  { value: 'Users', label: 'Users' },
  { value: 'Award', label: 'Award' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Trophy', label: 'Trophy' },
  { value: 'Smile', label: 'Smile' },
  { value: 'TrendingUp', label: 'Trending Up' },
]

const gradientOptions = [
  { value: 'from-primary-500 to-ocean-500', label: 'Primary to Ocean' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-gold-500 to-yellow-500', label: 'Gold to Yellow' },
  { value: 'from-emerald-500 to-teal-500', label: 'Emerald to Teal' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-red-500 to-orange-500', label: 'Red to Orange' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo to Purple' },
  { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
]

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'MapPin',
    gradient: 'from-primary-500 to-ocean-500',
    order_index: 0,
    is_active: true,
  })
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const data = await api.getAdminAchievements()
      setAchievements(data)
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      label: '',
      value: '',
      icon: 'MapPin',
      gradient: 'from-primary-500 to-ocean-500',
      order_index: achievements.length,
      is_active: true,
    })
    setShowCreateModal(true)
  }

  const handleEdit = (achievement: any) => {
    setSelectedAchievement(achievement)
    setFormData({
      label: achievement.label || '',
      value: achievement.value || '',
      icon: achievement.icon || 'MapPin',
      gradient: achievement.gradient || 'from-primary-500 to-ocean-500',
      order_index: achievement.order_index || 0,
      is_active: achievement.is_active !== undefined ? achievement.is_active : true,
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (showEditModal && selectedAchievement) {
        await api.updateAchievement(selectedAchievement.id, formData)
      } else {
        await api.createAchievement(formData)
      }
      
      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedAchievement(null)
      fetchAchievements()
    } catch (error: any) {
      alert(error.message || 'Failed to save achievement')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      await api.deleteAchievement(id)
      fetchAchievements()
    } catch (error: any) {
      alert(error.message || 'Failed to delete achievement')
    }
  }

  const handleToggleActive = async (achievement: any) => {
    try {
      await api.updateAchievement(achievement.id, {
        ...achievement,
        is_active: !achievement.is_active,
      })
      fetchAchievements()
    } catch (error: any) {
      alert(error.message || 'Failed to update achievement')
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newAchievements = [...achievements]
    const draggedAchievement = newAchievements[draggedItem]
    newAchievements.splice(draggedItem, 1)
    newAchievements.splice(index, 0, draggedAchievement)
    setAchievements(newAchievements)
    setDraggedItem(index)
  }

  const handleDragEnd = async () => {
    if (draggedItem === null) return

    const items = achievements.map((achievement, index) => ({
      id: achievement.id,
      order_index: index,
    }))

    try {
      await api.reorderAchievements(items)
      fetchAchievements()
    } catch (error: any) {
      alert(error.message || 'Failed to reorder achievements')
      fetchAchievements() // Revert on error
    } finally {
      setDraggedItem(null)
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
            Our Achievements Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage the achievements displayed in the "Our Achievements" section</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Achievement</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-xl border ${
                !achievement.is_active ? 'opacity-60 border-2 border-gray-300' : 'border-primary-200/50 dark:border-primary-800/50'
              } hover:shadow-2xl transition-all duration-300 cursor-move`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <GripVertical className="w-6 h-6 text-gray-400 cursor-grab" />
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.gradient} shadow-lg`}>
                    {(() => {
                      const IconComponent = iconMap[achievement.icon] || Award
                      return <IconComponent className="w-8 h-8 text-white" />
                    })()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {achievement.label}
                      </h3>
                      {!achievement.is_active && (
                        <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {achievement.value}
                      </span>
                      <span className="text-sm">Icon: {achievement.icon}</span>
                      <span className="text-sm">Order: {achievement.order_index}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(achievement)}
                    className={`p-2 rounded-lg transition-all ${
                      achievement.is_active
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={achievement.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {achievement.is_active ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-ocean-500 hover:from-primary-600 hover:to-ocean-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {achievements.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl border border-primary-200/50 dark:border-primary-800/50">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No achievements yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Create your first achievement to get started</p>
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
                {showEditModal ? 'Edit Achievement' : 'Create New Achievement'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setSelectedAchievement(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Label * (e.g., "Services", "Happy Clients")
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Service Packages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value * (e.g., "150", "5.0", "1K+")
                </label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="150"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Color
                  </label>
                  <select
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {gradientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Index (lower numbers appear first)
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedAchievement(null)
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
                  {showEditModal ? 'Update Achievement' : 'Create Achievement'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

