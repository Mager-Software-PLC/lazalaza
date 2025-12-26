import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Star, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'
import { api } from '@/lib/api'

export default function AboutSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content, settings } = useCMS()
  const [guides, setGuides] = useState<any[]>([])
  const [brandingColor, setBrandingColor] = useState<string | null>(null)
  const { sectionStyle, cardStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('about')

  // Listen for branding color changes
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

  const aboutTitle = (content && content['about_title']) || 'About Laza International'
  const aboutSubtitle = (content && content['about_subtitle']) || 'We are a one-stop service center specializing in Media Services, Event Management and Organization, Multimedia Production, Studio Recording, Advertising and Branding, Printing, Technology Solutions, Art and Culture Consultancy, and Translation Services.'
  const aboutStory = (content && content['about_story']) || 'Laza International is committed to serving our clients with excellence and creativity. We bring together a team of passionate professionals dedicated to delivering exceptional results across all our service areas.'
  const journeyTitle = (content && content['about_journey_title']) || 'Committed to Serve . Inspired to Create.'
  const journeyText1 = (content && content['about_journey_text_1']) || aboutStory
  const journeyText2 = (content && content['about_journey_text_2']) || 'We are a one-stop service center specializing in Media Services, Event Management and Organization, Multimedia Production, Studio Recording, Advertising and Branding, Printing, Technology Solutions, Art and Culture Consultancy, and Translation Services.'
  const journeyText3 = (content && content['about_journey_text_3']) || 'Our mission is to provide smart, tailored solutions that drive growth, boost efficiency, and deliver real results for our clients.'

  const feature1Title = (content && content['about_feature_1_title']) || 'Media Services'
  const feature1Desc = (content && content['about_feature_1_desc']) || 'Comprehensive media solutions for all your communication needs'
  const feature2Title = (content && content['about_feature_2_title']) || 'Event Management'
  const feature2Desc = (content && content['about_feature_2_desc']) || 'Professional event organization from planning to execution'
  const feature3Title = (content && content['about_feature_3_title']) || 'Multimedia Production'
  const feature3Desc = (content && content['about_feature_3_desc']) || 'Creative multimedia content that tells your story'
  const feature4Title = (content && content['about_feature_4_title']) || 'Technology Solutions'
  const feature4Desc = (content && content['about_feature_4_desc']) || 'Cutting-edge technology solutions for digital transformation'

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const data = await api.getGuides()
        setGuides(data)
      } catch (error) {
        console.error('Failed to fetch guides:', error)
      }
    }
    fetchGuides()
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
  }

  const features = [
    {
      icon: Users,
      title: feature1Title,
      description: feature1Desc,
    },
    {
      icon: Star,
      title: feature2Title,
      description: feature2Desc,
    },
    {
      icon: MapPin,
      title: feature3Title,
      description: feature3Desc,
    },
    {
      icon: Clock,
      title: feature4Title,
      description: feature4Desc,
    },
  ]

  // Only use default classes if no custom background is set
  const hasCustomBackground = sectionStyle.backgroundColor || sectionStyle.background || sectionStyle.backgroundImage
  
  // Build style object that will override Tailwind
  const finalSectionStyle: React.CSSProperties = {
    ...sectionStyle,
  }
  
  // If we have a custom background, ensure it overrides Tailwind classes
  if (hasCustomBackground) {
    // Remove any conflicting background properties and set explicitly
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
            {aboutTitle.split(' ').map((word, i) => 
              word.toLowerCase().includes('laza') || word.toLowerCase().includes('international') ? (
                <span key={i} className="gradient-text">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
          <p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2"
            style={textStyle}
          >
            {aboutSubtitle}
          </p>
          <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold italic max-w-3xl mx-auto">
            Committed to Serve . Inspired to Create.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {journeyTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {journeyText1}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {journeyText2}
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {journeyText3}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {settings?.about_image ? (
                <img
                  src={
                    settings.about_image.startsWith('http')
                      ? settings.about_image
                      : settings.about_image.startsWith('/')
                      ? settings.about_image
                      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${settings.about_image}`
                  }
                  alt="About Laza International"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 via-ocean-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Laza International</span>
                </div>
              )}
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-accent-500 rounded-full opacity-30 blur-xl"
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-primary-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-2xl transition-all border border-primary-100 dark:border-primary-800"
                style={cardStyle}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    index === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-600' :
                    index === 1 ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                    index === 2 ? 'bg-gradient-to-br from-ocean-400 to-ocean-600' :
                    'bg-gradient-to-br from-emerald-400 to-emerald-600'
                  }`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h4 
                  className="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
                  style={headingStyle}
                >
                  {feature.title}
                </h4>
                <p 
                  className="text-gray-600 dark:text-gray-300"
                  style={textStyle}
                >
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Meet Your Teams Section */}
        {guides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Meet Our <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Visionaries behind the creativity—driving excellence across media, events, and promotions. Passion-led, results-driven, and committed to making every project unforgettable.
            </p>
          </motion.div>
        )}

        {guides.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white via-primary-50/50 to-ocean-50/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 hover:shadow-2xl transition-all border border-primary-200/50 dark:border-primary-800/50"
              >
                <div className="mb-4">
                  {guide.image ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={getImageUrl(guide.image)}
                      alt={guide.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-200 dark:border-primary-800 shadow-lg"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary-400 to-ocean-400 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800 shadow-lg"
                    >
                      <Users className="w-16 h-16 text-white" />
                    </motion.div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {guide.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                  {guide.title}
                </p>
                {guide.bio && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {guide.bio}
                  </p>
                )}
                
                {/* Social Media Links */}
                {(guide.facebook_url || guide.instagram_url || guide.twitter_url || guide.linkedin_url || guide.youtube_url) && (
                  <div className="flex items-center justify-center space-x-3 mt-4 pt-4 border-t border-primary-200/50 dark:border-primary-800/50">
                    {guide.facebook_url && (
                      <motion.a
                        href={guide.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                    )}
                    {guide.instagram_url && (
                      <motion.a
                        href={guide.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </motion.a>
                    )}
                    {guide.twitter_url && (
                      <motion.a
                        href={guide.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-black dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-700 text-white transition-colors"
                        title="Twitter/X"
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                    )}
                    {guide.linkedin_url && (
                      <motion.a
                        href={guide.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                    )}
                    {guide.youtube_url && (
                      <motion.a
                        href={guide.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-5 h-5" />
                      </motion.a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

