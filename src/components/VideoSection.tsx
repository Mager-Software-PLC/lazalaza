import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Youtube } from 'lucide-react'
import { api } from '@/lib/api'
import { useCMS } from '@/contexts/CMSContext'
import { useSectionStyle } from '@/hooks/useSectionStyle'

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export default function VideoSection() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { content } = useCMS()
  const { sectionStyle, headingStyle, textStyle, overlayColor } = useSectionStyle('videos')

  const videosTitle = (content && content['videos_title']) || 'Our Videos'
  const videosSubtitle = (content && content['videos_subtitle']) || 'Watch our amazing Service experiences and adventures'

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await api.getVideos()
        setVideos(data)
      } catch (error) {
        console.error('Failed to fetch videos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const handleVideoClick = (youtubeUrl: string) => {
    const videoId = getYouTubeVideoId(youtubeUrl)
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
    }
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

  return (
    <section
      ref={ref}
      className={`section-padding relative ${!hasCustomBackground ? (typeof window !== 'undefined' && localStorage.getItem('branding_background_color') ? 'bg-transparent' : 'bg-gradient-to-b from-white to-primary-50 dark:from-slate-900 dark:to-slate-800') : ''}`}
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
            {videosTitle.split(' ').map((word, i) =>
              word.toLowerCase().includes('video') || word.toLowerCase().includes('videos') ? (
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
            {videosSubtitle}
          </p>
        </motion.div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No videos available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => {
            const videoId = getYouTubeVideoId(video.youtube_url)
            const thumbnail = videoId ? getYouTubeThumbnail(videoId) : video.thumbnail_url

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative aspect-video overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 flex items-center justify-center">
                      <Youtube className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleVideoClick(video.youtube_url)}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all"
                    >
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
          </div>
        )}
      </div>
    </section>
  )
}

