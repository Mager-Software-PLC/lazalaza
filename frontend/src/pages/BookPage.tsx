import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import BookingForm from '@/components/BookingForm'

export default function BookPage() {
  const [Services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
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
        if (data.length > 0) {
          setSelectedService(data[0])
        }
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
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Request Our <span className="gradient-text">Service</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get in touch with us to discuss your project needs
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : selectedService ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Select Service
                </h2>
                <div className="space-y-4 mb-8">
                  {Services.map((Service) => (
                    <button
                      key={Service.id}
                      onClick={() => setSelectedService(Service)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedService.id === Service.id
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {Service.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        ${Service.price}/person • {Service.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Booking Details
                </h2>
                <BookingForm ServiceId={selectedService.id} ServicePrice={selectedService.price} />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-300">No services available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

