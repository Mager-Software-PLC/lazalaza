import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Calendar, Star, MapPin, Award, Heart, Globe, Trophy, Smile, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'

// Icon mapping
const iconMap: { [key: string]: any } = {
  MapPin,
  Calendar,
  Star,
  Users,
  Award,
  Heart,
  Globe,
  Trophy,
  Smile,
  TrendingUp,
}

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [achievements, setAchievements] = useState<any[]>([])
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
    const fetchAchievements = async () => {
      try {
        const data = await api.getAchievements()
        setAchievements(data)
      } catch (error) {
        // Fallback to default achievements if API fails
        setAchievements([
          {
            label: 'Service Packages',
            value: '3',
            icon: 'MapPin',
            gradient: 'from-primary-500 to-ocean-500',
            order_index: 0,
          },
          {
            label: 'Happy Guests',
            value: '150',
            icon: 'Calendar',
            gradient: 'from-purple-500 to-pink-500',
            order_index: 1,
          },
          {
            label: 'Average Rating',
            value: '5.0',
            icon: 'Star',
            gradient: 'from-gold-500 to-yellow-500',
            order_index: 2,
          },
          {
            label: 'Destinations',
            value: '1',
            icon: 'Users',
            gradient: 'from-emerald-500 to-teal-500',
            order_index: 3,
          },
        ])
      }
    }
    fetchAchievements()
  }, [])

  const statItems = achievements.map((achievement, index) => ({
    icon: iconMap[achievement.icon] || MapPin,
    value: achievement.value,
    label: achievement.label,
    gradient: achievement.gradient,
    delay: (index + 1) * 0.1,
  }))

  return (
    <section ref={ref} className={`section-padding ${brandingColor ? 'bg-transparent' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 text-white">
            Our <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: item.delay }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${item.gradient} mb-4 shadow-2xl group-hover:shadow-${item.gradient.split('-')[1]}-500/50 transition-all duration-300`}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: item.delay + 0.3 }}
                >
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {item.value}
                    {item.label === 'Average Rating' && <span className="text-2xl">★</span>}
                  </p>
                  <p className="text-gray-300 font-medium">{item.label}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

