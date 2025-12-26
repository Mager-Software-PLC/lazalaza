import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, Layout, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'

interface Section {
  id?: number
  section_key: string
  section_name: string
  visible: boolean
  order_index: number
}

const DEFAULT_SECTIONS: Section[] = [
  { section_key: 'hero', section_name: 'Hero Section', visible: true, order_index: 0 },
  { section_key: 'about', section_name: 'About Section', visible: true, order_index: 1 },
  { section_key: 'videos', section_name: 'Videos Section', visible: true, order_index: 2 },
  { section_key: 'Services', section_name: 'Service Packages', visible: true, order_index: 3 },
  { section_key: 'partners', section_name: 'Partners Section', visible: true, order_index: 4 },
  { section_key: 'stats', section_name: 'Stats/Achievements', visible: true, order_index: 5 },
  { section_key: 'testimonials', section_name: 'Testimonials', visible: true, order_index: 6 },
  { section_key: 'gallery', section_name: 'Gallery', visible: true, order_index: 7 },
  { section_key: 'contact', section_name: 'Contact Section', visible: true, order_index: 8 },
]

export default function CMSSectionsPage() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      setLoading(true)
      const data = await api.getSectionVisibility()
      
      if (Array.isArray(data) && data.length > 0) {
        // Merge with defaults to ensure all sections exist
        const sectionMap = new Map<string, Section>()
        DEFAULT_SECTIONS.forEach(defaultSection => {
          sectionMap.set(defaultSection.section_key, { ...defaultSection })
        })
        
        data.forEach((item: any) => {
          sectionMap.set(item.section_key, {
            id: item.id,
            section_key: item.section_key,
            section_name: item.section_name || item.section_key,
            visible: item.visible !== undefined ? item.visible : true,
            order_index: item.order_index !== undefined ? item.order_index : 0,
          })
        })
        
        setSections(Array.from(sectionMap.values()).sort((a, b) => a.order_index - b.order_index))
      } else {
        setSections(DEFAULT_SECTIONS)
      }
    } catch (error: any) {
      console.error('Failed to load sections:', error)
      setSections(DEFAULT_SECTIONS)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      
      const sectionsToSave = sections.map((section, index) => ({
        section_key: section.section_key,
        section_name: section.section_name,
        visible: section.visible,
        order_index: index,
      }))
      
      await api.reorderSections(sectionsToSave)
      setMessage({ type: 'success', text: 'Section order and visibility saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save sections' })
    } finally {
      setSaving(false)
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
    setSections(newSections)
  }

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
    setSections(newSections)
  }

  const toggleVisibility = (index: number) => {
    const newSections = [...sections]
    newSections[index].visible = !newSections[index].visible
    setSections(newSections)
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
            <Layout className="w-8 h-8" />
            <span>Section Order & Visibility</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control the order and visibility of sections from hero to footer
          </p>
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
              <span>Save Order</span>
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

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6">
          <div className="space-y-3">
            {sections.map((section, index) => (
              <motion.div
                key={section.section_key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  section.visible
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
                      disabled={index === sections.length - 1}
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {section.section_name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        ({section.section_key})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleVisibility(index)}
                    className={`p-2 rounded-lg transition-all ${
                      section.visible
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={section.visible ? 'Hide section' : 'Show section'}
                  >
                    {section.visible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Sections are displayed in the order shown above. Hidden sections will not appear on the frontend. 
          Changes take effect immediately after saving.
        </p>
      </div>
    </div>
  )
}

