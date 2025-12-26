import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, ArrowRight } from 'lucide-react'
import { useCMS } from '@/contexts/CMSContext'

// Helper functions to get media URLs
const getVideoUrl = (path: string | null | undefined) => {
  if (!path) return '/videos/niagara-falls.mp4'
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return path
  return `/uploads/${path}`
}

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return path
  return `/uploads/${path}`
}

export default function HeroSection() {
  const { hero, content, loading } = useCMS()

  const heroTitle = (content && content['hero_title']) || (hero && hero.title) || 'Laza International'
  const heroSubtitle = (content && content['hero_subtitle']) || (hero && hero.subtitle) || 'Media and Communications'
  const primaryButtonText = (content && content['hero_primary_button']) || (hero && hero.primary_button_text) || 'Services'
  const primaryButtonLink = (hero && hero.primary_button_link) || '/contact'
  const secondaryButtonText = (content && content['hero_secondary_button']) || (hero && hero.secondary_button_text) || 'Request Us'
  const secondaryButtonLink = (hero && hero.secondary_button_link) || '/book'
  
  const backgroundVideo = hero && hero.background_video ? getVideoUrl(hero.background_video) : '/videos/niagara-falls.mp4'
  const backgroundImage = hero && hero.background_image ? getImageUrl(hero.background_image) : null

  // Determine which background to show
  const showVideo = backgroundVideo && !backgroundImage
  const showImage = backgroundImage

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        {showVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
            <source src={backgroundVideo} type="video/webm" />
            <source src={backgroundVideo} type="video/quicktime" />
          </video>
        )}
        {showImage && (
          <div
            className="w-full h-full object-cover bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {!showVideo && !showImage && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
            <source src={backgroundVideo} type="video/webm" />
            <source src={backgroundVideo} type="video/quicktime" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Floating Water Droplets */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="water-droplet"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight"
          >
            {heroTitle.split(' ').map((word: string, i: number) => 
              word.toLowerCase().includes('laza') || word.toLowerCase().includes('international') ? (
                <span key={i} className="gradient-text">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-4 text-gray-200"
          >
            {heroSubtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl mb-8 text-primary-300 font-semibold italic"
          >
            Committed to Serve . Inspired to Create.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {primaryButtonLink.startsWith('http') ? (
              <a href={primaryButtonLink} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2 shadow-2xl transform transition-all duration-300"
                >
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </a>
            ) : (
              <Link to={primaryButtonLink}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2 shadow-2xl transform transition-all duration-300"
                >
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}
            {secondaryButtonLink.startsWith('http') ? (
              <a href={secondaryButtonLink} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500/20 to-accent-500/20 hover:from-purple-500/30 hover:to-accent-500/30 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2 border-2 border-purple-300/50 hover:border-purple-200/70 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>{secondaryButtonText}</span>
                </motion.button>
              </a>
            ) : (
              <Link to={secondaryButtonLink}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500/20 to-accent-500/20 hover:from-purple-500/30 hover:to-accent-500/30 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-lg text-lg flex items-center space-x-2 border-2 border-purple-300/50 hover:border-purple-200/70 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>{secondaryButtonText}</span>
                </motion.button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

