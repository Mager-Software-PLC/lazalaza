import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [images, setImages] = useState<Array<{ id: number; src: string; alt: string; description?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('gallery')

  const galleryTitle = (content && content['gallery_title']) || 'Portfolio'
  const gallerySubtitle = (content && content['gallery_subtitle']) || 'From bold visuals to flawless events, our portfolio proves how we turn ideas into impact—with creativity, precision, and results.'

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery()
        const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
        const baseUrl = API_URL.replace('/api', '')
        
        setImages(
          data.map((item: any, index: number) => ({
            id: item.id || index,
            src: item.src.startsWith('http') ? item.src : `${baseUrl}${item.src}`,
            alt: item.alt || `Gallery image ${index + 1}`,
            description: item.description,
          }))
        )
      } catch (error) {
        // Fallback to placeholder images
        setImages([
          { id: 1, src: '/images/gallery/1.jpg', alt: 'Niagara Falls view' },
          { id: 2, src: '/images/gallery/2.jpg', alt: 'Service showcase' },
          { id: 3, src: '/images/gallery/3.jpg', alt: 'Maid of the Mist' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length)
    }
  }

  const hasCustomBackground = sectionStyle.backgroundColor || sectionStyle.background || sectionStyle.backgroundImage

  // Build style object that will override Tailwind
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

  const defaultBg = brandingColor ? 'bg-transparent' : 'bg-gradient-to-b from-emerald-50 via-primary-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
  
  return (
    <>
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
              {galleryTitle.split(' ').map((word, i) => 
                word.toLowerCase().includes('portfolio') ? (
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
              {gallerySubtitle}
            </p>
          </motion.div>

          {/* Masonry Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">No gallery images yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => {
                const hasFailed = failedImages.has(image.id)
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => openLightbox(index)}
                  >
                    {hasFailed ? (
                      <div className={`w-full h-full flex items-center justify-center ${
                        index % 4 === 0 ? 'bg-gradient-to-br from-primary-400 to-ocean-500' :
                        index % 4 === 1 ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                        index % 4 === 2 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                        'bg-gradient-to-br from-accent-400 to-orange-500'
                      }`}>
                        <span className="text-white text-sm font-semibold">{image.alt}</span>
                      </div>
                    ) : (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => {
                          setFailedImages(prev => new Set(prev).add(image.id))
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="text-white text-lg font-semibold"
                      >
                        View
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] relative"
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              {images[selectedImage].description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                  <p className="text-sm">{images[selectedImage].description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

