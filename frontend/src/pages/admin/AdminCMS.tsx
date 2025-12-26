import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CMSContentPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      const data = await api.getCMSContent()
      // API returns object directly
      setContent(data || {})
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      await api.updateCMSContentMultiple(content)
      setMessage({ type: 'success', text: 'Content saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const contentSections = [
    {
      title: 'Hero Section',
      keys: ['hero_title', 'hero_subtitle', 'hero_primary_button', 'hero_secondary_button'],
    },
    {
      title: 'About Section',
      keys: ['about_title', 'about_subtitle', 'about_story', 'about_journey_title', 'about_journey_text_1', 'about_journey_text_2', 'about_journey_text_3', 'about_feature_1_title', 'about_feature_1_desc', 'about_feature_2_title', 'about_feature_2_desc', 'about_feature_3_title', 'about_feature_3_desc', 'about_feature_4_title', 'about_feature_4_desc'],
    },
    {
      title: 'Services Section',
      keys: ['Services_title', 'Services_subtitle', 'Services_view_all_button'],
    },
    {
      title: 'Testimonials Section',
      keys: ['testimonials_title', 'testimonials_subtitle', 'testimonials_read_more'],
    },
    {
      title: 'Gallery Section',
      keys: ['gallery_title', 'gallery_subtitle'],
    },
    {
      title: 'Contact Section',
      keys: ['contact_title', 'contact_subtitle', 'contact_info_title', 'contact_info_text', 'contact_phone_label', 'contact_phone', 'contact_email_label', 'contact_email', 'contact_location_label', 'contact_location', 'contact_form_name_label', 'contact_form_email_label', 'contact_form_phone_label', 'contact_form_message_label', 'contact_form_submit_button', 'contact_form_success_message', 'contact_form_error_message'],
    },
    {
      title: 'Footer',
      keys: ['footer_description', 'footer_company_title', 'footer_support_title', 'footer_contact_title', 'footer_copyright'],
    },
    {
      title: 'Navbar',
      keys: ['navbar_home', 'navbar_Services', 'navbar_about', 'navbar_reviews', 'navbar_contact', 'navbar_book_now', 'navbar_staff_portal', 'navbar_dashboard'],
    },
    {
      title: 'Buttons & Actions',
      keys: ['button_book_now', 'button_view_Services', 'button_view_all', 'button_read_more', 'button_send_message', 'button_submit', 'button_save', 'button_cancel', 'button_delete'],
    },
  ]

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
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Edit all text content on your website</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save All Changes</span>
            </>
          )}
        </motion.button>
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

      <div className="grid gap-6">
        {contentSections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.keys.map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <textarea
                    value={content[key] || ''}
                    onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    rows={key.includes('story') || key.includes('description') ? 4 : 2}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

