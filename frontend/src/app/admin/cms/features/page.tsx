import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { Save, Loader2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react'

export default function CMSFeaturesPage() {
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      setLoading(true)
      const data = await api.getCMSFeatures()
      setFeatures(Array.isArray(data) ? data : [])
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const toggleFeature = async (key: string, enabled: boolean) => {
    try {
      setSaving(true)
      await api.updateCMSFeature(key, enabled)
      setFeatures(features.map((f) => (f.feature_key === key ? { ...f, enabled } : f)))
      setMessage({ type: 'success', text: 'Feature updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
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
      <div>
        <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent flex items-center space-x-2">
          <ToggleLeft className="w-8 h-8" />
          <span>Site Features</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Enable or disable website features</p>
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

      <div className="grid gap-4">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{feature.feature_name}</h3>
              {feature.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
              )}
            </div>
            <button
              onClick={() => toggleFeature(feature.feature_key, !feature.enabled)}
              disabled={saving}
              className={`ml-4 p-3 rounded-lg transition-all ${
                feature.enabled
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              } disabled:opacity-50`}
            >
              {feature.enabled ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

