import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Navigation, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Star, Home, MapPin, Users, MessageSquare, Mail } from 'lucide-react'

interface NavbarItem {
  id?: number
  label: string
  href: string
  icon: string | null
  order_index: number
  is_active: boolean
  is_external: boolean
  target: string
}

// Icon mapping for common icons
const ICON_MAP: Record<string, any> = {
  'Star': Star,
  'Home': Home,
  'MapPin': MapPin,
  'Users': Users,
  'MessageSquare': MessageSquare,
  'Mail': Mail,
  'null': null,
  '': null,
}

export default function NavbarManagementPage() {
  const [items, setItems] = useState<NavbarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<NavbarItem>>({
    label: '',
    href: '',
    icon: null,
    order_index: 0,
    is_active: true,
    is_external: false,
    target: '_self',
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await api.getNavbarItemsManage()
      setItems(Array.isArray(data) ? data : [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load navbar items' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: NavbarItem) => {
    try {
      setSaving(true)
      setMessage(null)
      
      if (item.id) {
        await api.updateNavbarItem(item.id, item)
        setMessage({ type: 'success', text: 'Navbar item updated successfully!' })
      } else {
        await api.createNavbarItem(item)
        setMessage({ type: 'success', text: 'Navbar item created successfully!' })
      }
      
      setTimeout(() => setMessage(null), 3000)
      await loadItems()
      setEditingId(null)
      setShowAddForm(false)
      setFormData({
        label: '',
        href: '',
        icon: null,
        order_index: 0,
        is_active: true,
        is_external: false,
        target: '_self',
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save navbar item' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setSaving(true)
      setMessage(null)
      await api.deleteNavbarItem(id)
      setMessage({ type: 'success', text: 'Navbar item deleted successfully!' })
      setTimeout(() => setMessage(null), 3000)
      await loadItems()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete navbar item' })
    } finally {
      setSaving(false)
    }
  }

  const handleReorder = async () => {
    try {
      setSaving(true)
      const itemsToSave = items.map((item, index) => ({
        id: item.id!,
        order_index: index,
      }))
      await api.reorderNavbarItems(itemsToSave)
      setMessage({ type: 'success', text: 'Navbar order saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
      await loadItems()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to reorder navbar items' })
    } finally {
      setSaving(false)
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    setItems(newItems)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setItems(newItems)
  }

  const toggleActive = async (item: NavbarItem) => {
    const updated = { ...item, is_active: !item.is_active }
    await handleSave(updated)
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
            <Navigation className="w-8 h-8" />
            <span>Navbar Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add, edit, delete, and reorder navbar menu items
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReorder}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Order...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Order</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({
                label: '',
                href: '',
                icon: null,
                order_index: items.length,
                is_active: true,
                is_external: false,
                target: '_self',
              })
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </motion.button>
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

      {/* Add/Edit Form */}
      {(showAddForm || editingId !== null) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-primary-200 dark:border-primary-800 p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Navbar Item' : 'Add New Navbar Item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={formData.label || ''}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL/Href *
              </label>
              <input
                type="text"
                value={formData.href || ''}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="/ or /Services or https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon (lucide-react name)
              </label>
              <select
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">No Icon</option>
                <option value="Star">Star</option>
                <option value="Home">Home</option>
                <option value="MapPin">MapPin</option>
                <option value="Users">Users</option>
                <option value="MessageSquare">MessageSquare</option>
                <option value="Mail">Mail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_external || false}
                  onChange={(e) => setFormData({ ...formData, is_external: e.target.checked, target: e.target.checked ? '_blank' : '_self' })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">External Link</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                setFormData({
                  label: '',
                  href: '',
                  icon: null,
                  order_index: 0,
                  is_active: true,
                  is_external: false,
                  target: '_self',
                })
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const itemToSave: NavbarItem = {
                  ...formData,
                  label: formData.label || '',
                  href: formData.href || '/',
                  order_index: formData.order_index || 0,
                  is_active: formData.is_active !== false,
                  is_external: formData.is_external || false,
                  target: formData.target || '_self',
                } as NavbarItem
                if (editingId) {
                  itemToSave.id = editingId
                }
                handleSave(itemToSave)
              }}
              disabled={saving || !formData.label || !formData.href}
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Navbar Items List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navbar Items</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No navbar items found. Click "Add Item" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const Icon = item.icon ? ICON_MAP[item.icon] : null
                const isEditing = editingId === item.id
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      item.is_active
                        ? 'bg-gradient-to-r from-white to-primary-50/50 dark:from-slate-800 dark:to-slate-700 border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === items.length - 1}
                          className="p-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-8">
                            #{index + 1}
                          </span>
                          {Icon && <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {item.label}
                              </h3>
                              {isEditing && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">
                                  Editing
                                </span>
                              )}
                              {!item.is_active && (
                                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.href} {item.is_external && <span className="text-orange-600 dark:text-orange-400">(External - Opens in new tab)</span>}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActive(item)}
                          className={`p-2 rounded-lg transition-all ${
                            item.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                          title={item.is_active ? 'Hide item' : 'Show item'}
                        >
                          {item.is_active ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingId(item.id!)
                            setShowAddForm(false)
                            setFormData({ ...item })
                            // Scroll to form
                            setTimeout(() => {
                              document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-xl')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }, 100)
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Edit</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${item.label}"? This action cannot be undone.`)) {
                              handleDelete(item.id!)
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Navbar items are displayed in the order shown above. Inactive items will not appear on the frontend. 
          Changes take effect immediately after saving. Use "Save Order" to persist the current order.
        </p>
      </div>
    </div>
  )
}

