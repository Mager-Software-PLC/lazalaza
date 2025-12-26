import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Send, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [brandingColor, setBrandingColor] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    rating: 5,
    comment: '',
  })

  // Check for branding color and listen for changes
  useEffect(() => {
    const checkBrandingColor = () => {
      const color = typeof window !== 'undefined' ? localStorage.getItem('branding_background_color') : null
      setBrandingColor(color)
    }
    
    checkBrandingColor()
    
    const handleBrandingChange = () => {
      checkBrandingColor()
    }
    
    window.addEventListener('brandingColorChanged' as any, handleBrandingChange as EventListener)
    window.addEventListener('themeColorChanged' as any, handleBrandingChange as EventListener)
    
    return () => {
      window.removeEventListener('brandingColorChanged' as any, handleBrandingChange as EventListener)
      window.removeEventListener('themeColorChanged' as any, handleBrandingChange as EventListener)
    }
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${path}`
  }

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.getTestimonials()
        setTestimonials(data)
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.createTestimonial(formData)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        location: '',
        rating: 5,
        comment: '',
      })
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
        // Refresh testimonials
        fetchTestimonials()
      }, 2000)
    } catch (error: any) {
      alert(error.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const data = await api.getTestimonials()
      setTestimonials(data)
    } catch (error) {
      // Error handled silently
    }
  }

  return (
    <div className="pt-20">
      <section className={`section-padding ${brandingColor ? 'bg-transparent' : 'bg-white dark:bg-slate-900'}`}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Guest <span className="gradient-text">Reviews</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Read what our guests have to say about their experiences
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
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
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    {testimonial.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Submit Review Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-gradient-to-br from-primary-50 via-purple-50 to-ocean-50 dark:from-slate-800 dark:via-slate-700 rounded-2xl p-8 shadow-xl border border-primary-200/50 dark:border-primary-800/50"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display mb-2 text-gray-900 dark:text-white">
                Share Your <span className="gradient-text">Experience</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We'd love to hear about your Service experience!
              </p>
            </div>

            {!showForm && !submitted && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2 mx-auto"
                >
                  <Star className="w-5 h-5" />
                  <span>Write a Review</span>
                </motion.button>
              </div>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your review has been submitted and will be reviewed before being published.
                </p>
              </motion.div>
            )}

            {showForm && !submitted && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="John Doe"
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
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Toronto, Canada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className={`p-2 rounded-lg transition-all ${
                          formData.rating >= rating
                            ? 'bg-gold-100 dark:bg-gold-900/30'
                            : 'bg-gray-100 dark:bg-slate-700'
                        }`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            formData.rating >= rating
                              ? 'fill-gold-400 text-gold-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        name: '',
                        email: '',
                        location: '',
                        rating: 5,
                        comment: '',
                      })
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-2xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

