import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import ServiceCard from '@/components/ServiceCard'

export default function ServicesPage() {
  const [Services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices()
        setServices(data)
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide smart, tailored solutions that drive growth, boost efficiency, and deliver real results
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Services.map((Service, index) => (
                <motion.div
                  key={Service.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ServiceCard Service={Service} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

