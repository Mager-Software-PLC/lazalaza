import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [Services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [formData, setFormData] = useState({
    Service_id: '',
    user_name: '',
    email: '',
    phone: '',
    booking_date: '',
    guests: '1',
    status: 'pending',
    special_requests: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsData, ServicesData] = await Promise.all([
        api.adminRequest('/bookings'),
        api.getServices(),
      ])
      setBookings(bookingsData)
      setServices(ServicesData)
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      Service_id: '',
      user_name: '',
      email: '',
      phone: '',
      booking_date: new Date().toISOString().split('T')[0],
      guests: '1',
      status: 'pending',
      special_requests: '',
    })
    setShowCreateModal(true)
  }

  const handleEdit = (booking: any) => {
    setSelectedBooking(booking)
    setFormData({
      Service_id: booking.Service_id?.toString() || '',
      user_name: booking.user_name || '',
      email: booking.email || '',
      phone: booking.phone || '',
      booking_date: booking.booking_date || new Date().toISOString().split('T')[0],
      guests: booking.guests?.toString() || '1',
      status: booking.status || 'pending',
      special_requests: booking.special_requests || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bookingData = {
        ...formData,
        Service_id: parseInt(formData.Service_id),
        guests: parseInt(formData.guests),
      }

      if (showEditModal && selectedBooking) {
        await api.adminRequest(`/bookings/${selectedBooking.id}`, {
          method: 'PUT',
          body: bookingData,
        })
      } else {
        // Create booking - can use public endpoint or admin endpoint
        await api.createBooking(bookingData)
      }
      
      setShowCreateModal(false)
      setShowEditModal(false)
      setSelectedBooking(null)
      fetchData()
    } catch (error: any) {
      alert(error.message || 'Failed to save booking')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      await api.adminRequest(`/bookings/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      alert('Failed to delete booking')
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.adminRequest(`/bookings/${id}`, {
        method: 'PUT',
        body: { status },
      })
      fetchData()
    } catch (error) {
      alert('Failed to update booking status')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700',
      confirmed: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700',
      completed: 'bg-gradient-to-r from-primary-100 to-ocean-100 text-primary-800 dark:from-primary-900/30 dark:to-ocean-900/30 dark:text-primary-200 border border-primary-300 dark:border-primary-700',
      cancelled: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-200 border border-red-300 dark:border-red-700',
    }
    return colors[status] || colors.pending
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Bookings Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage all bookings</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Booking</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white via-primary-50/30 to-ocean-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl shadow-xl overflow-hidden border border-primary-200/50 dark:border-primary-800/50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-accent-500/10 dark:from-slate-700 dark:to-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:via-purple-50/50 hover:to-accent-50/50 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-300 border-b border-primary-100/30 dark:border-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.user_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {booking.Service?.title || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{booking.guests}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${booking.total_price || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(booking.status)} cursor-pointer transition-all shadow-sm hover:shadow-md`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-primary-600 hover:text-primary-700 p-2 rounded-lg bg-gradient-to-br from-primary-100 to-ocean-100 dark:from-primary-900/20 dark:to-ocean-900/20 hover:from-primary-200 hover:to-ocean-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 hover:from-red-200 hover:to-orange-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No bookings yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Create your first booking to get started</p>
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
                {showEditModal ? 'Edit Booking' : 'Create New Booking'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setSelectedBooking(null)
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
                    Service *
                  </label>
                  <select
                    required
                    value={formData.Service_id}
                    onChange={(e) => setFormData({ ...formData, Service_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a Service</option>
                    {Services.map((Service) => (
                      <option key={Service.id} value={Service.id}>
                        {Service.title} - ${Service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.booking_date}
                    onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${getStatusColor(formData.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  rows={3}
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setSelectedBooking(null)
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
                  {showEditModal ? 'Update Booking' : 'Create Booking'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

