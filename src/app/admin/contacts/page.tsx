import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Check, Trash2, Edit, X } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    replied: false,
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const data = await api.adminRequest('/contact')
      setContacts(data)
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contact: any) => {
    setSelectedContact(contact)
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      message: contact.message || '',
      replied: contact.replied || false,
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.adminRequest(`/contact/${selectedContact.id}`, {
        method: 'PUT',
        body: formData,
      })
      
      setShowEditModal(false)
      setSelectedContact(null)
      fetchContacts()
    } catch (error: any) {
      alert(error.message || 'Failed to update contact')
    }
  }

  const handleMarkReplied = async (id: number) => {
    try {
      await api.adminRequest(`/contact/${id}`, {
        method: 'PUT',
        body: { replied: true },
      })
      fetchContacts()
    } catch (error) {
      // Error handled silently
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await api.adminRequest(`/contact/${id}`, { method: 'DELETE' })
      fetchContacts()
    } catch (error) {
      // Error handled silently
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
          Contact Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Manage customer inquiries and messages</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br from-white via-ocean-50/30 to-primary-50/30 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-xl border ${
                !contact.replied ? 'border-2 border-primary-400 shadow-primary-200/50' : 'border-primary-200/50 dark:border-primary-800/50'
              } hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {contact.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-primary-500" />
                        <span className="text-gray-700 dark:text-gray-300">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(contact.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{contact.message}</p>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => handleEdit(contact)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-ocean-500 hover:from-primary-600 hover:to-ocean-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                {!contact.replied && (
                  <button
                    onClick={() => handleMarkReplied(contact.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as Replied</span>
                  </button>
                )}
                {contact.replied && (
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-semibold rounded-full shadow-md">
                    Replied
                  </span>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No contact messages yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Contact messages from your website will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Contact Message
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedContact(null)
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="replied"
                  checked={formData.replied}
                  onChange={(e) => setFormData({ ...formData, replied: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="replied" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as Replied
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedContact(null)
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
                  Update Contact
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

