import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, Send, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('testimonials')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    rating: 5,
    comment: '',
  })

  const testimonialsTitle = (content && content['testimonials_title']) || 'What Our Guests Say'
  const testimonialsSubtitle = (content && content['testimonials_subtitle']) || 'Don\'t just take our word for it—hear from travelers who\'ve experienced the magic'
  const readMoreText = (content && content['testimonials_read_more']) || (content && content['button_read_more']) || 'Read More Reviews →'

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${path}`
  }

  const fetchTestimonials = async () => {
    try {
      const data = await api.getTestimonials()
      setTestimonials(data.slice(0, 6)) // Show first 6
    } catch (error) {
      // Fallback data
      setTestimonials([
        {
          id: 1,
          name: 'Sarah Johnson',
          rating: 5,
          comment: 'Absolutely incredible experience! Kaleb was an amazing guide who made our Service unforgettable.',
          location: 'Toronto, Canada',
        },
        {
          id: 2,
          name: 'Michael Chen',
          rating: 5,
          comment: 'The private premium Service was worth every penny. Complete flexibility and luxury vehicle.',
          location: 'New York, USA',
        },
        {
          id: 3,
          name: 'Emma Williams',
          rating: 5,
          comment: 'Perfect day Service! Small group was great for meeting people, and the guide was knowledgeable.',
          location: 'London, UK',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

  const hasCustomBackground = sectionStyle.backgroundColor || sectionStyle.background || sectionStyle.backgroundImage

  // Build style object that will override Tailwind
  const finalSectionStyle: React.CSSProperties = {
    ...sectionStyle,
  }
  
  if (hasCustomBackground) {
    if (sectionStyle.background) {
      finalSectionStyle.background = sectionStyle.background
    } else if (sectionStyle.backgroundColor) {
      finalSectionStyle.backgroundColor = sectionStyle.backgroundColor
    }
    if (sectionStyle.backgroundImage) {
      finalSectionStyle.backgroundImage = sectionStyle.backgroundImage
      finalSectionStyle.backgroundSize = sectionStyle.backgroundSize || 'cover'
      finalSectionStyle.backgroundPosition = sectionStyle.backgroundPosition || 'center'
    }
  }

  const [brandingColor, setBrandingColor] = useState<string | null>(null)

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

  const defaultBg = brandingColor ? 'bg-transparent' : 'bg-gradient-to-b from-white via-purple-50 to-ocean-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
  
  return (
    <section 
      id="testimonials"
      ref={ref} 
      className={`section-padding relative ${!hasCustomBackground ? defaultBg : ''}`}
      style={finalSectionStyle}
    >
      {overlayColor && (
        <div 
          className="absolute inset-0 z-0"
          style={{ backgroundColor: overlayColor }}
        />
      )}
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900 dark:text-white"
            style={headingStyle}
          >
            {testimonialsTitle.split(' ').map((word, i) => 
              word.toLowerCase().includes('guests') || word.toLowerCase().includes('say') ? (
                <span key={i} className="gradient-text">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
          <p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            style={textStyle}
          >
            {testimonialsSubtitle}
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
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white to-primary-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-primary-100 dark:border-primary-800 relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className={`w-16 h-16 ${
                    index % 3 === 0 ? 'text-primary-600' :
                    index % 3 === 1 ? 'text-purple-600' :
                    'text-ocean-600'
                  }`} />
                </div>

                {/* Image */}
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

                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 relative z-10 italic">
                  "{testimonial.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    {testimonial.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12 space-y-4"
        >
          {!showForm && !submitted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              <span>Share Your Experience</span>
            </motion.button>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Thank you! Your review has been submitted.</span>
            </motion.div>
          )}

          {showForm && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-primary-200/50 dark:border-primary-800/50"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
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
                    className="px-6 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="px-8 py-2 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-2xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </form>
            </motion.div>
          )}

          <a
            href="/testimonials"
            className="block text-primary-600 dark:text-primary-400 font-semibold hover:underline mt-4"
          >
            {readMoreText}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

