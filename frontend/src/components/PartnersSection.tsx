import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'

export default function PartnersSection() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('partners')

  const partnersTitle = (content && content['partners_title']) || 'Our Clients & Partners'
  const partnersSubtitle = (content && content['partners_subtitle']) || 'Trusted by leading organizations and partners'

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.getPartners()
        setPartners(data)
      } catch (error) {
        console.error('Failed to fetch partners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  // Auto-scroll animation
  useEffect(() => {
    if (!scrollContainerRef.current || partners.length === 0) {
      return
    }

    const container = scrollContainerRef.current
    let scrollPosition = 0
    let animationFrameId: number

    const scroll = () => {
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth
      const maxScroll = scrollWidth - clientWidth

      scrollPosition += 0.5 // Adjust speed here
      
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0
      }
      
      container.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [partners])

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
  }

  const hasCustomBackground = sectionStyle.backgroundColor || sectionStyle.background || sectionStyle.backgroundImage

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

  if (loading) {
    return null
  }

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners]

  return (
    <section
      ref={ref}
      className={`section-padding relative ${!hasCustomBackground ? (typeof window !== 'undefined' && localStorage.getItem('branding_background_color') ? 'bg-transparent' : 'bg-gradient-to-b from-primary-50 via-ocean-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800') : ''}`}
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
            {partnersTitle.split(' ').map((word, i) =>
              word.toLowerCase().includes('partner') || word.toLowerCase().includes('partners') ? (
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
            {partnersSubtitle}
          </p>
        </motion.div>

        {partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No partners available yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              data-partners-scroll
              className="flex gap-8 items-center"
              style={{
                scrollBehavior: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {duplicatedPartners.map((partner, index) => (
              <motion.a
                key={`${partner.id}-${index}`}
                href={partner.website_url || '#'}
                target={partner.website_url ? '_blank' : undefined}
                rel={partner.website_url ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-4 border-2 border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600"
              >
                {partner.logo_url ? (
                  <img
                    src={getImageUrl(partner.logo_url)}
                    alt={partner.name}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-primary-600 dark:text-primary-400 font-bold text-sm text-center">${partner.name}</span>`
                      }
                    }}
                  />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-sm text-center">
                    {partner.name}
                  </span>
                )}
              </motion.a>
              ))}
            </div>
          </div>
        )}

        <style>{`
          [data-partners-scroll]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  )
}

