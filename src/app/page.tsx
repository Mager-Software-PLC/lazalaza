import { useCMS } from '@/contexts/CMSContext'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import VideoSection from '@/components/VideoSection'
import ServicePackages from '@/components/ServicePackages'
import PartnersSection from '@/components/PartnersSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import GallerySection from '@/components/GallerySection'
import StatsSection from '@/components/StatsSection'
import ContactSection from '@/components/ContactSection'

const sectionComponents: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  videos: VideoSection,
  Services: ServicePackages,
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
    { section_key: 'Services', visible: true, order_index: 3 },
    { section_key: 'partners', visible: true, order_index: 4 },
    { section_key: 'stats', visible: true, order_index: 5 },
    { section_key: 'testimonials', visible: true, order_index: 6 },
    { section_key: 'gallery', visible: true, order_index: 7 },
    { section_key: 'contact', visible: true, order_index: 8 },
  ]

  // Use sections from CMS if available, otherwise use defaults
  const activeSections = (sections && sections.length > 0 ? sections : defaultSections)
    .filter((section: any) => section.visible !== false)
    .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))

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

