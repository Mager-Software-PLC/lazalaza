import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Users, Heart, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import { api } from '@/lib/api'

export default function AboutPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [guides, setGuides] = useState<any[]>([])
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://backend.lazabusinessgroup.net/api'
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
  }

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love what we do and it shows in every Service we conduct.',
    },
    {
      icon: Users,
      title: 'Personalization',
      description: 'Every Service is tailored to create the perfect experience for our guests.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service.',
    },
    {
      icon: MapPin,
      title: 'Expertise',
      description: 'Years of experience and deep knowledge in media and communications.',
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-cyan-600">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container-custom text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold font-display mb-4"
          >
            About Laza International
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Committed to Serve . Inspired to Create.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={ref} className={`section-padding ${brandingColor ? 'bg-transparent' : 'bg-white dark:bg-slate-900'}`}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Laza International was born from a simple belief: that every project deserves excellence, creativity, and personalized attention. We are committed to serving our clients with dedication and inspired to create solutions that make a lasting impact.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We recognized that businesses and organizations need comprehensive media and communication services that go beyond the ordinary. We set out to create something different—a one-stop service center that combines expertise in media services, event management, multimedia production, and technology solutions.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Today, Laza International has become a trusted name in media and communications. Our commitment to excellence, personalized service, and creating meaningful connections with our clients sets us apart.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section-padding ${brandingColor ? 'bg-transparent' : 'bg-gray-50 dark:bg-slate-800'}`}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Our <span className="gradient-text">Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4"
                  >
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guide Section */}
      {guides.length > 0 && (
        <section className={`section-padding ${brandingColor ? 'bg-transparent' : 'bg-white dark:bg-slate-900'}`}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900 dark:text-white">
                Meet Your <span className="gradient-text">Guides</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our passionate and experienced team is here to bring your vision to life
              </p>
            </motion.div>

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
                    {guide.image && !failedImages.has(guide.id) ? (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={getImageUrl(guide.image)}
                        alt={guide.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-200 dark:border-primary-800 shadow-lg"
                        onError={() => {
                          setFailedImages(prev => new Set(prev).add(guide.id))
                        }}
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
          </div>
        </section>
      )}
    </div>
  )
}

