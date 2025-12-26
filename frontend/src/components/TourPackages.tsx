import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Clock, Star } from 'lucide-react'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'
import TourCard from './TourCard'

export default function ServicePackages() {
  const [Services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('Services')

  const ServicesTitle = (content && content['Services_title']) || 'Our Services'
  const ServicesSubtitle = (content && content['Services_subtitle']) || 'We provide smart, tailored solutions that drive growth, boost efficiency, and deliver real results.'
  const viewAllServicesText = (content && content['Services_view_all_button']) || (content && content['button_view_all']) || 'Explore More'

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices()
        console.log('Fetched tours data:', data)
        if (data && Array.isArray(data) && data.length > 0) {
          setServices(data)
          console.log(`Loaded ${data.length} tours`)
        } else {
          console.warn('No tours found from API, data:', data)
          setServices([])
        }
      } catch (error) {
        console.error('Error fetching tours:', error)
        // Fallback to default services if API fails
        setServices([
          {
            id: 1,
            title: 'Multi-Media Production',
            slug: 'multi-media-production',
            short_description: 'We craft and integrates multimedia—video, audio, graphics, animation, and interactive content—to tell stories, share ideas, and elevate brands across digital platforms with creative and technical excellence.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/multimedia.jpg'],
            highlights: ['Video production', 'Audio production', 'Graphics & animation'],
          },
          {
            id: 2,
            title: 'Event Organization',
            slug: 'event-organization',
            short_description: 'We design and manage unforgettable events of every scale — From intimate social gatherings to grand cultural festivals and high-level presidential events, we organize every occasion with excellence and precision.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/events.jpg'],
            highlights: ['Event planning', 'Management & execution', 'All event types'],
          },
          {
            id: 3,
            title: 'Advertising and Branding',
            slug: 'advertising-branding',
            short_description: 'Laza International delivers impactful advertising and branding services that build strong identities and connect businesses with their audiences.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/advertising.jpg'],
            highlights: ['Brand identity', 'Marketing campaigns', 'Creative solutions'],
          },
          {
            id: 4,
            title: 'Printing',
            slug: 'printing',
            short_description: 'Laza International offers high-quality printing services that bring designs to life with precision and style—perfect for marketing materials, packaging, and professional branding needs.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/printing.jpg'],
            highlights: ['High-quality printing', 'Marketing materials', 'Professional branding'],
          },
          {
            id: 5,
            title: 'Technologies',
            slug: 'technologies',
            short_description: 'Laza International provides cutting-edge technology solutions that empower businesses with innovation, efficiency, and digital transformation.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/technology.jpg'],
            highlights: ['Digital transformation', 'Innovation', 'Efficiency solutions'],
          },
          {
            id: 6,
            title: 'Media Service',
            slug: 'media-service',
            short_description: 'Laza International offers sharp, engaging media services—from content creation to digital production—that bring stories to life.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/media.jpg'],
            highlights: ['Content creation', 'Digital production', 'Media solutions'],
          },
          {
            id: 7,
            title: 'Art & Culture Consultancy',
            slug: 'art-culture-consultancy',
            short_description: 'Promoting creativity, heritage, and cultural expression through expert guidance and collaboration.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/art-culture.jpg'],
            highlights: ['Cultural expression', 'Heritage promotion', 'Expert guidance'],
          },
          {
            id: 8,
            title: 'Translation Service',
            slug: 'translation-service',
            short_description: 'Accurate, culturally sensitive, and professional translation solutions for effective communication.',
            price: 0,
            duration: 'Custom',
            group_size: 'All sizes',
            images: ['/images/services/translation.jpg'],
            highlights: ['Accurate translations', 'Cultural sensitivity', 'Professional service'],
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const hasCustomBackground = sectionStyle.backgroundColor || sectionStyle.background || sectionStyle.backgroundImage

  // Build style object that will override Tailwind
  const finalSectionStyle: React.CSSProperties = {
    ...sectionStyle,
  }
  
  // If we have a custom background, ensure it overrides Tailwind classes
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

  const defaultBg = brandingColor ? 'bg-transparent' : 'bg-gradient-to-b from-primary-50 via-ocean-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
  
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
            {ServicesTitle.split(' ').map((word, i) => 
              word.toLowerCase().includes('services') ? (
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
            {ServicesSubtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : Services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Services.map((Service, index) => (
              <motion.div
                key={Service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TourCard Service={Service} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/tours">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-accent-500 hover:from-purple-600 hover:to-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {viewAllServicesText}
              <ArrowRight className="w-5 h-5 inline-block ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

