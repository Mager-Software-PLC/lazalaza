import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, Mail, Phone, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor, buttonStyle } = useSectionStyle('contact')

  const contactTitle = (content && content['contact_title']) || 'Get In Touch'
  const contactSubtitle = (content && content['contact_subtitle']) || '💡 Would you like to start a project with us? From stunning decor & seamless event hosting to media, photography, printing, and promotion—we bring your vision to life, all in one place. Let\'s create something unforgettable together.'
  const contactInfoTitle = (content && content['contact_info_title']) || 'Contact Information'
  const contactInfoText = (content && content['contact_info_text']) || 'Reach out to us through any of these channels. We\'re here to help bring your vision to life.'
  const contactPhoneLabel = (content && content['contact_phone_label']) || 'Phone'
  const contactPhone = (content && content['contact_phone']) || '+251962190971/+251912692309'
  const contactEmailLabel = (content && content['contact_email_label']) || 'Email'
  const contactEmail = (content && content['contact_email']) || 'contact@lazainternational.com'
  const contactLocationLabel = (content && content['contact_location_label']) || 'Location'
  const contactLocation = (content && content['contact_location']) || 'Selam City Center  6th Floor Mekelle,Tigray,Ethiopia'
  const formNameLabel = (content && content['contact_form_name_label']) || 'Name'
  const formEmailLabel = (content && content['contact_form_email_label']) || 'Email'
  const formPhoneLabel = (content && content['contact_form_phone_label']) || 'Phone (Optional)'
  const formMessageLabel = (content && content['contact_form_message_label']) || 'Message'
  const formSubmitButton = (content && content['contact_form_submit_button']) || (content && content['button_send_message']) || 'Send Message'
  const formSuccessMessage = (content && content['contact_form_success_message']) || 'Message sent successfully! We\'ll get back to you soon.'
  const formErrorMessage = (content && content['contact_form_error_message']) || 'Failed to send message. Please try again.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await api.createContact(formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

  const defaultBg = brandingColor ? 'bg-transparent' : 'bg-white dark:bg-slate-900'
  
  return (
    <section 
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
            {contactTitle.split(' ').map((word, i) => 
              word.toLowerCase().includes('touch') ? (
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
            {contactSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {contactInfoTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {contactInfoText}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{contactPhoneLabel}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{contactEmailLabel}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{contactLocationLabel}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{contactLocation}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formEmailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formPhoneLabel}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formMessageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                  {formSuccessMessage}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
                  {formErrorMessage}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={buttonStyle.backgroundColor ? buttonStyle : undefined}
                className={`w-full font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !buttonStyle.backgroundColor 
                    ? 'bg-gradient-to-r from-primary-600 via-ocean-600 to-emerald-600 hover:from-primary-700 hover:via-ocean-700 hover:to-emerald-700 text-white' 
                    : ''
                }`}
                onMouseEnter={(e) => {
                  if (buttonStyle['--hover-bg']) {
                    e.currentTarget.style.backgroundColor = buttonStyle['--hover-bg'] as string
                  }
                }}
                onMouseLeave={(e) => {
                  if (buttonStyle.backgroundColor) {
                    e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor as string
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{formSubmitButton}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

