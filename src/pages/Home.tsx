import { useCMS } from '@/contexts/CMSContext'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import VideoSection from '@/components/VideoSection'
import TourPackages from '@/components/TourPackages'
import PartnersSection from '@/components/PartnersSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import GallerySection from '@/components/GallerySection'
import StatsSection from '@/components/StatsSection'
import ContactSection from '@/components/ContactSection'

const sectionComponents: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  videos: VideoSection,
  Services: TourPackages,
  partners: PartnersSection,
  stats: StatsSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  contact: ContactSection,
}

export default function Home() {
  const { sections, loading } = useCMS()

  // Default order if sections not loaded yet
  const defaultSections = [
    { section_key: 'hero', visible: true, order_index: 0 },
    { section_key: 'about', visible: true, order_index: 1 },
    { section_key: 'videos', visible: true, order_index: 2 },
    { section_key: 'Services', visible: true, order_index: 3 }, // Services right after Videos
    { section_key: 'partners', visible: true, order_index: 4 },
    { section_key: 'stats', visible: true, order_index: 5 },
    { section_key: 'testimonials', visible: true, order_index: 6 },
    { section_key: 'gallery', visible: true, order_index: 7 },
    { section_key: 'contact', visible: true, order_index: 8 },
  ]

  // Use sections from CMS if available, otherwise use defaults
  let activeSections = (sections && sections.length > 0 ? sections : defaultSections)
    .filter((section: any) => section.visible !== false)
    .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
  
  // Ensure Services section is always visible and positioned right after Videos
  const servicesSection = activeSections.find((s: any) => s.section_key === 'Services')
  const videosSection = activeSections.find((s: any) => s.section_key === 'videos')
  
  if (!servicesSection) {
    // Add Services section if it doesn't exist, right after Videos
    const videosOrderIndex = videosSection ? (videosSection.order_index || 2) : 2
    const servicesDefault = { section_key: 'Services', visible: true, order_index: videosOrderIndex + 1 }
    activeSections.push(servicesDefault)
  } else {
    // Ensure Services is visible and positioned right after Videos
    servicesSection.visible = true
    if (videosSection) {
      servicesSection.order_index = (videosSection.order_index || 2) + 1
    } else {
      servicesSection.order_index = 3
    }
  }
  
  // Re-sort after ensuring Services is included
  activeSections = activeSections
    .filter((section: any) => section.visible !== false)
    .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
  
  // Debug: Log sections in development
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('Home page sections:', activeSections)
  }

  // Check for branding color to ensure sections are transparent
  const brandingColor = typeof window !== 'undefined' ? localStorage.getItem('branding_background_color') : null
  
  return (
    <div className="overflow-hidden" style={brandingColor ? { backgroundColor: 'transparent' } : {}}>
      {activeSections.map((section: any) => {
        const Component = sectionComponents[section.section_key]
        if (!Component) return null
        return <Component key={section.section_key} />
      })}
    </div>
  )
}

