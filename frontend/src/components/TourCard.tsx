import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Clock, ArrowRight, Star } from 'lucide-react'

interface ServiceCardProps {
  Service: any
  index: number
}

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // If it starts with /, it's a relative path from the backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
  const baseUrl = API_URL.replace('/api', '')
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`
}

// Helper function to normalize images array
const normalizeImages = (images: any): string[] => {
  if (!images) return []
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  if (Array.isArray(images)) {
    return images.filter(img => img && typeof img === 'string')
  }
  return []
}

export default function ServiceCard({ Service, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Normalize and get the first image if available
  const images = normalizeImages(Service.images)
  const imageUrl = images.length > 0 && images[0] 
    ? getImageUrl(images[0]) 
    : null

  // Determine card theme based on Service
  const getCardTheme = () => {
    if (Service.title.includes('Private Premium')) {
      return 'luxury'
    } else if (Service.title.includes('Small Group Day')) {
      return 'energetic'
    }
    return 'default'
  }

  const theme = getCardTheme()

  const cardStyles = {
    luxury: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white border-purple-400 shadow-purple-500/20',
    energetic: 'bg-gradient-to-br from-ocean-500 via-primary-500 to-emerald-500 text-white shadow-ocean-500/20',
    default: 'bg-gradient-to-br from-white via-primary-50 to-ocean-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-gray-900 dark:text-white border-primary-300 dark:border-primary-600 shadow-primary-500/10',
  }

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl overflow-hidden shadow-xl border-2 ${cardStyles[theme]} transition-all duration-300 card-3d`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Badge */}
      {Service.title.includes('Private Premium') && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-gold-400 to-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
          >
            <Star className="w-3 h-3" />
            <span>PREMIUM</span>
          </motion.div>
        </div>
      )}
      {Service.title.includes('Ultra Small') && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-primary-500 to-ocean-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            MOST POPULAR
          </motion.div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl && !imageError ? (
          <motion.img
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            src={imageUrl}
            alt={Service.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <motion.div
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full bg-gradient-to-br from-primary-400 via-ocean-400 to-emerald-400 flex items-center justify-center"
          >
            <span className="text-white text-lg font-semibold text-center px-4">{Service.title}</span>
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{Service.title}</h3>
        <p className="text-sm opacity-90 mb-4 line-clamp-2">
          {Service.short_description || Service.description}
        </p>

        {/* Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{Service.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{Service.group_size}</span>
          </div>
        </div>

        {/* Highlights */}
        {Service.highlights && Array.isArray(Service.highlights) && (
          <ul className="mb-4 space-y-1 text-sm">
            {Service.highlights.slice(0, 3).map((highlight: string, i: number) => (
              <li key={i} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-ocean-500" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-700">
          {Service.price > 0 ? (
            <div>
              <span className="text-3xl font-bold">${Service.price}</span>
              <span className="text-sm opacity-75">/person</span>
            </div>
          ) : (
            <div>
              <span className="text-lg font-semibold opacity-75">Custom Pricing</span>
            </div>
          )}
          <Link to={`/tours/${Service.slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                theme === 'luxury' || theme === 'energetic'
                  ? 'bg-gradient-to-r from-white to-gray-50 text-slate-900 hover:from-gray-50 hover:to-white shadow-lg'
                  : 'bg-gradient-to-r from-primary-600 to-ocean-600 text-white hover:from-primary-700 hover:to-ocean-700 shadow-lg'
              }`}
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* 3D Effect Overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
          }}
        />
      )}
    </motion.div>
  )
}

