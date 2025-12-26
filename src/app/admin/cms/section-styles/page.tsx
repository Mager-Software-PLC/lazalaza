import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Palette, Eye, EyeOff, Type, Layers, Image as ImageIcon, Sparkles, Download, RotateCcw } from 'lucide-react'
import { getDefaultStyles } from './defaultStyles'

interface SectionStyle {
  id?: number
  section_key: string
  section_name: string
  background_color?: string
  background_gradient?: string
  background_image?: string
  background_overlay?: string
  text_color?: string
  heading_color?: string
  subheading_color?: string
  font_family?: string
  heading_font?: string
  body_font?: string
  font_size_base?: string
  card_background?: string
  card_border_color?: string
  card_border_radius?: string
  card_shadow?: string
  card_text_color?: string
  button_background?: string
  button_text_color?: string
  button_hover_background?: string
  custom_styles?: string
  is_published?: boolean
}

const DEFAULT_SECTIONS = [
  { section_key: 'hero', section_name: 'Hero Section' },
  { section_key: 'about', section_name: 'About Section' },
  { section_key: 'Services', section_name: 'Service Packages' },
  { section_key: 'stats', section_name: 'Stats/Achievements' },
  { section_key: 'testimonials', section_name: 'Testimonials' },
  { section_key: 'gallery', section_name: 'Gallery' },
  { section_key: 'contact', section_name: 'Contact Section' },
]

export default function SectionStylesPage() {
  const [styles, setStyles] = useState<Record<string, SectionStyle>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  useEffect(() => {
    loadStyles()
  }, [])

  const loadStyles = async () => {
    try {
      setLoading(true)
      const data = await api.getSectionStyles()
      
      const stylesObj: Record<string, SectionStyle> = {}
      
      // Initialize with defaults from frontend components
      DEFAULT_SECTIONS.forEach(section => {
        const defaultStyle = getDefaultStyles(section.section_key)
        stylesObj[section.section_key] = {
          ...defaultStyle,
          is_published: false,
        }
      })
      
      // Override with loaded data from database
      if (Array.isArray(data)) {
        data.forEach((style: SectionStyle) => {
          // Merge with defaults to ensure all fields exist
          stylesObj[style.section_key] = {
            ...getDefaultStyles(style.section_key),
            ...style,
          }
        })
      }
      
      setStyles(stylesObj)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load section styles' })
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentFrontendStyles = (sectionKey: string) => {
    const defaultStyle = getDefaultStyles(sectionKey)
    
    setStyles(prev => ({
      ...prev,
      [sectionKey]: {
        ...defaultStyle,
        is_published: prev[sectionKey]?.is_published || false,
      },
    }))
    
    setMessage({ 
      type: 'success', 
      text: `Loaded current frontend styles for ${defaultStyle.section_name}` 
    })
    setTimeout(() => setMessage(null), 3000)
  }

  const updateStyle = (sectionKey: string, field: keyof SectionStyle, value: any) => {
    setStyles(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }))
  }

  const handleSave = async (sectionKey: string) => {
    try {
      setSaving(true)
      setMessage(null)
      await api.updateSectionStyle(sectionKey, styles[sectionKey])
      setMessage({ type: 'success', text: `${styles[sectionKey].section_name} styles saved successfully!` })
      setTimeout(() => setMessage(null), 3000)
      // Reload to get updated data
      await loadStyles()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save styles' })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (sectionKey: string) => {
    try {
      setPublishing(sectionKey)
      setMessage(null)
      await api.publishSectionStyle(sectionKey)
      setMessage({ type: 'success', text: `${styles[sectionKey].section_name} styles published!` })
      setTimeout(() => setMessage(null), 3000)
      await loadStyles()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to publish styles' })
    } finally {
      setPublishing(null)
    }
  }

  const handlePublishAll = async () => {
    try {
      setPublishing('all')
      setMessage(null)
      await api.publishAllSectionStyles()
      setMessage({ type: 'success', text: 'All section styles published successfully!' })
      setTimeout(() => setMessage(null), 3000)
      await loadStyles()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to publish all styles' })
    } finally {
      setPublishing(null)
    }
  }

  const getPreviewStyle = (sectionKey: string): React.CSSProperties => {
    const style = styles[sectionKey]
    if (!style) return {}
    
    const previewStyle: React.CSSProperties = {}
    
    // Background
    if (style.background_gradient) {
      try {
        const gradient = JSON.parse(style.background_gradient)
        previewStyle.background = `linear-gradient(${gradient.direction || '135deg'}, ${gradient.colors?.join(', ') || '#06b6d4, #a855f7'})`
      } catch {
        previewStyle.background = style.background_color || '#ffffff'
      }
    } else if (style.background_color) {
      previewStyle.background = style.background_color
    }
    
    if (style.background_image) {
      previewStyle.backgroundImage = `url(${style.background_image.startsWith('http') ? style.background_image : `/uploads/${style.background_image}`})`
      previewStyle.backgroundSize = 'cover'
      previewStyle.backgroundPosition = 'center'
    }
    
    // Text colors
    if (style.text_color) previewStyle.color = style.text_color
    
    // Fonts
    if (style.font_family) previewStyle.fontFamily = style.font_family
    if (style.font_size_base) previewStyle.fontSize = style.font_size_base
    
    return previewStyle
  }

  const getCardPreviewStyle = (sectionKey: string): React.CSSProperties => {
    const style = styles[sectionKey]
    if (!style) return {}
    
    const cardStyle: React.CSSProperties = {}
    
    if (style.card_background) cardStyle.backgroundColor = style.card_background
    if (style.card_border_color) cardStyle.borderColor = style.card_border_color
    if (style.card_border_radius) cardStyle.borderRadius = style.card_border_radius
    if (style.card_shadow) cardStyle.boxShadow = style.card_shadow
    if (style.card_text_color) cardStyle.color = style.card_text_color
    
    return cardStyle
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
            <Palette className="w-8 h-8" />
            <span>Section Styles</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize colors, fonts, backgrounds, and card styles for each section. Each section can have its own unique styling.
          </p>
          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>How it works:</strong> Each section (Hero, About, Services, etc.) can be styled independently. 
              Use the preview card to see changes in real-time. Click "Save Styles" to save as draft, then "Publish" to make it live on your website.
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePublishAll}
          disabled={publishing === 'all'}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {publishing === 'all' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Publish All</span>
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

      {/* Explanation Box */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border-2 border-primary-200 dark:border-primary-800 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary-600" />
          <span>How Section Styling Works</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">✓ Each Section is Independent</h3>
            <p>Each section (Hero, About, Services, etc.) can have its own unique colors, fonts, and styles. Changes to one section don't affect others.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">✓ Preview Before Publishing</h3>
            <p>Use the preview card to see exactly how your section will look. Make changes, save as draft, then publish when ready.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">✓ Two-Step Process</h3>
            <p><strong>Step 1:</strong> Click "Show Style Options" → Make changes → Click "Save as Draft"<br/>
            <strong>Step 2:</strong> Click "Publish to Website" to make it live</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">✓ What Gets Styled</h3>
            <p>You can customize: Background colors/images, Text colors, Fonts, Card styles, and Button styles for each section.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {DEFAULT_SECTIONS.map((section, index) => {
          const style = styles[section.section_key] || {
            section_key: section.section_key,
            section_name: section.section_name,
          }
          const isSelected = selectedSection === section.section_key
          const previewStyle = getPreviewStyle(section.section_key)
          const cardStyle = getCardPreviewStyle(section.section_key)

          return (
            <motion.div
              key={section.section_key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Preview Card */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    {style.is_published ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <EyeOff className="w-4 h-4" />
                        <span>Draft</span>
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="p-8 relative overflow-hidden rounded-lg border-2 border-gray-300 dark:border-slate-600"
                  style={previewStyle}
                >
                  {style.background_overlay && (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: style.background_overlay }}
                    />
                  )}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: style.heading_color || previewStyle.color || '#1f2937' }}>
                      {section.section_name} Preview
                    </h2>
                    <p className="mb-4" style={{ color: style.text_color || previewStyle.color || '#4b5563' }}>
                      This preview shows how your section will look on the website.
                    </p>
                    
                    {/* Preview Card Example */}
                    <div
                      className="p-6 rounded-lg border-2"
                      style={{
                        ...cardStyle,
                        borderColor: style.card_border_color || '#e5e7eb',
                        borderWidth: '2px',
                        backgroundColor: style.card_background || cardStyle.backgroundColor || '#ffffff',
                      }}
                    >
                      <h3 className="text-xl font-semibold mb-2" style={{ color: style.heading_color || cardStyle.color || '#1f2937' }}>
                        Sample Card Title
                      </h3>
                      <p className="mb-4" style={{ color: style.text_color || cardStyle.color || '#4b5563' }}>
                        This is how cards within this section will appear.
                      </p>
                      {style.button_background && (
                        <button
                          className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                          style={{
                            backgroundColor: style.button_background,
                            color: style.button_text_color || '#ffffff',
                          }}
                        >
                          Sample Button
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Style Controls */}
              <div className="p-6 border-t border-gray-200 dark:border-slate-700">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Customize {section.section_name}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => loadCurrentFrontendStyles(section.section_key)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                      title="Load current styles from frontend"
                    >
                      <Download className="w-4 h-4" />
                      <span>Load Current Styles</span>
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Adjust the styles below to change how this section appears on your website. 
                    Click "Load Current Styles" to see what's currently applied on the frontend.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSection(isSelected ? null : section.section_key)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-lg hover:from-primary-100 hover:to-purple-100 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-colors border border-primary-200 dark:border-slate-700"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isSelected ? '▼ Hide' : '▶ Show'} Style Options
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">{isSelected ? '−' : '+'}</span>
                </button>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-6"
                  >
                    {/* Background Styles */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Layers className="w-5 h-5" />
                        <span>Background</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Set the background color, gradient, or image for this section
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.background_color || '#ffffff'}
                              onChange={(e) => updateStyle(section.section_key, 'background_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.background_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'background_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Overlay
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.background_overlay || '#000000'}
                              onChange={(e) => updateStyle(section.section_key, 'background_overlay', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.background_overlay || ''}
                              onChange={(e) => updateStyle(section.section_key, 'background_overlay', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="rgba(0,0,0,0.5)"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Gradient (JSON: {"{"}"direction": "135deg", "colors": ["#06b6d4", "#a855f7"]{"}"})
                          </label>
                          <textarea
                            value={style.background_gradient || ''}
                            onChange={(e) => updateStyle(section.section_key, 'background_gradient', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            rows={2}
                            placeholder='{"direction": "135deg", "colors": ["#06b6d4", "#a855f7"]}'
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Image URL
                          </label>
                          <input
                            type="text"
                            value={style.background_image || ''}
                            onChange={(e) => updateStyle(section.section_key, 'background_image', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            placeholder="/uploads/image.jpg or https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text Colors */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Palette className="w-5 h-5" />
                        <span>Text Colors</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Choose colors for text, headings, and subheadings in this section
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Text Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.text_color || '#1f2937'}
                              onChange={(e) => updateStyle(section.section_key, 'text_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.text_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'text_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#1f2937"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Heading Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.heading_color || '#111827'}
                              onChange={(e) => updateStyle(section.section_key, 'heading_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.heading_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'heading_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#111827"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subheading Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.subheading_color || '#4b5563'}
                              onChange={(e) => updateStyle(section.section_key, 'subheading_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.subheading_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'subheading_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#4b5563"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fonts */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Type className="w-5 h-5" />
                        <span>Fonts</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Select font families and sizes for this section
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Family
                          </label>
                          <select
                            value={style.font_family || ''}
                            onChange={(e) => updateStyle(section.section_key, 'font_family', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Default (Inter)</option>
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="Poppins, sans-serif">Poppins</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Lato, sans-serif">Lato</option>
                            <option value="Montserrat, sans-serif">Montserrat</option>
                            <option value="Playfair Display, serif">Playfair Display</option>
                            <option value="Merriweather, serif">Merriweather</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Heading Font
                          </label>
                          <select
                            value={style.heading_font || ''}
                            onChange={(e) => updateStyle(section.section_key, 'heading_font', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Default</option>
                            <option value="Poppins, sans-serif">Poppins</option>
                            <option value="Playfair Display, serif">Playfair Display</option>
                            <option value="Montserrat, sans-serif">Montserrat</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Body Font
                          </label>
                          <select
                            value={style.body_font || ''}
                            onChange={(e) => updateStyle(section.section_key, 'body_font', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Default</option>
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Lato, sans-serif">Lato</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Base Font Size
                          </label>
                          <input
                            type="text"
                            value={style.font_size_base || ''}
                            onChange={(e) => updateStyle(section.section_key, 'font_size_base', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            placeholder="16px or 1rem"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Styles */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <ImageIcon className="w-5 h-5" />
                        <span>Card Styles</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Customize how cards (boxes) appear within this section
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Background
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.card_background || '#ffffff'}
                              onChange={(e) => updateStyle(section.section_key, 'card_background', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.card_background || ''}
                              onChange={(e) => updateStyle(section.section_key, 'card_background', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Border Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.card_border_color || '#e5e7eb'}
                              onChange={(e) => updateStyle(section.section_key, 'card_border_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.card_border_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'card_border_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#e5e7eb"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Border Radius
                          </label>
                          <input
                            type="text"
                            value={style.card_border_radius || ''}
                            onChange={(e) => updateStyle(section.section_key, 'card_border_radius', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            placeholder="8px or 0.5rem"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Shadow
                          </label>
                          <input
                            type="text"
                            value={style.card_shadow || ''}
                            onChange={(e) => updateStyle(section.section_key, 'card_shadow', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            placeholder="0 4px 6px rgba(0,0,0,0.1)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Text Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.card_text_color || '#1f2937'}
                              onChange={(e) => updateStyle(section.section_key, 'card_text_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.card_text_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'card_text_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#1f2937"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Button Styles */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Sparkles className="w-5 h-5" />
                        <span>Button Styles</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Style buttons that appear in this section
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Button Background
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.button_background || '#06b6d4'}
                              onChange={(e) => updateStyle(section.section_key, 'button_background', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.button_background || ''}
                              onChange={(e) => updateStyle(section.section_key, 'button_background', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#06b6d4"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Button Text Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.button_text_color || '#ffffff'}
                              onChange={(e) => updateStyle(section.section_key, 'button_text_color', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.button_text_color || ''}
                              onChange={(e) => updateStyle(section.section_key, 'button_text_color', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Button Hover Background
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={style.button_hover_background || '#0891b2'}
                              onChange={(e) => updateStyle(section.section_key, 'button_hover_background', e.target.value)}
                              className="w-16 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.button_hover_background || ''}
                              onChange={(e) => updateStyle(section.section_key, 'button_hover_background', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                              placeholder="#0891b2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          <strong>Important:</strong> Click "Save Styles" to save your changes as a draft. 
                          Then click "Publish" to make the styles visible on your website. 
                          You can preview changes before publishing.
                        </p>
                      </div>
                      <div className="flex items-center justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSave(section.section_key)}
                          disabled={saving}
                          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Save as Draft</span>
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePublish(section.section_key)}
                          disabled={publishing === section.section_key || style.is_published}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                          {publishing === section.section_key ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              <span>{style.is_published ? '✓ Published' : 'Publish to Website'}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

