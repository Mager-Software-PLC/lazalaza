import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Mail, Phone, User } from 'lucide-react'
import { api } from '@/lib/api'

interface BookingFormProps {
  ServiceId: number
  ServicePrice: number
}

export default function BookingForm({ ServiceId, ServicePrice }: BookingFormProps) {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    booking_date: '',
    guests: 1,
    special_requests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await api.createBooking({
        ...formData,
        Service_id: ServiceId,
      })
      setSubmitStatus('success')
      setFormData({
        user_name: '',
        email: '',
        phone: '',
        booking_date: '',
        guests: 1,
        special_requests: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const totalPrice = ServicePrice * formData.guests

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="user_name"
            name="user_name"
            required
            value={formData.user_name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="booking_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            id="booking_date"
            name="booking_date"
            required
            value={formData.booking_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Guests
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            id="guests"
            name="guests"
            required
            value={formData.guests}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          id="special_requests"
          name="special_requests"
          rows={3}
          value={formData.special_requests}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Total Price */}
      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
          Booking submitted successfully! We'll confirm your reservation soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
          Failed to submit booking. Please try again.
        </div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Submit Request'}
      </motion.button>
    </form>
  )
}

