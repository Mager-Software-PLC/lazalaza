// Default styles extracted from current frontend components
// These represent what's currently applied on the website

export const DEFAULT_SECTION_STYLES: Record<string, any> = {
  hero: {
    section_key: 'hero',
    section_name: 'Hero Section',
    background_color: null, // Uses video/image background
    background_gradient: null,
    background_image: null,
    background_overlay: 'rgba(0, 0, 0, 0.4)', // Dark overlay on video
    text_color: '#ffffff', // White text
    heading_color: '#ffffff', // White headings
    subheading_color: '#e5e7eb', // Light gray for subtitle
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: null,
    card_border_color: null,
    card_border_radius: null,
    card_shadow: null,
    card_text_color: null,
    button_background: null, // Uses gradient buttons
    button_text_color: '#ffffff',
    button_hover_background: null,
  },
  about: {
    section_key: 'about',
    section_name: 'About Section',
    background_color: '#ffffff', // bg-white
    background_gradient: null,
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: '#ffffff', // Cards use white/gradient
    card_border_color: '#dbeafe', // border-primary-100
    card_border_radius: '0.75rem', // rounded-xl
    card_shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    card_text_color: '#111827', // text-gray-900
    button_background: null,
    button_text_color: null,
    button_hover_background: null,
  },
  Services: {
    section_key: 'Services',
    section_name: 'Service Packages',
    background_color: null,
    background_gradient: JSON.stringify({ direction: '135deg', colors: ['#e0f2fe', '#bae6fd', '#ffffff'] }), // from-primary-50 via-ocean-50 to-white
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: '#ffffff', // White cards
    card_border_color: '#e5e7eb', // border-gray-200
    card_border_radius: '1rem', // rounded-2xl
    card_shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card_text_color: '#111827', // text-gray-900
    button_background: null,
    button_text_color: null,
    button_hover_background: null,
  },
  stats: {
    section_key: 'stats',
    section_name: 'Stats/Achievements',
    background_color: '#ffffff', // bg-white
    background_gradient: null,
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif',
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: '#ffffff',
    card_border_color: '#e5e7eb',
    card_border_radius: '1rem',
    card_shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    card_text_color: '#111827',
    button_background: null,
    button_text_color: null,
    button_hover_background: null,
  },
  testimonials: {
    section_key: 'testimonials',
    section_name: 'Testimonials',
    background_color: null,
    background_gradient: JSON.stringify({ direction: '135deg', colors: ['#ffffff', '#faf5ff', '#e0f2fe'] }), // from-white via-purple-50 to-ocean-50
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: '#ffffff', // White testimonial cards
    card_border_color: '#e5e7eb', // border-gray-200
    card_border_radius: '1rem', // rounded-2xl
    card_shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card_text_color: '#111827', // text-gray-900
    button_background: null,
    button_text_color: null,
    button_hover_background: null,
  },
  gallery: {
    section_key: 'gallery',
    section_name: 'Gallery',
    background_color: null,
    background_gradient: JSON.stringify({ direction: '135deg', colors: ['#ecfdf5', '#e0f2fe', '#ffffff'] }), // from-emerald-50 via-primary-50 to-white
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: null, // Gallery images don't use cards
    card_border_color: null,
    card_border_radius: null,
    card_shadow: null,
    card_text_color: null,
    button_background: null,
    button_text_color: null,
    button_hover_background: null,
  },
  contact: {
    section_key: 'contact',
    section_name: 'Contact Section',
    background_color: '#ffffff', // bg-white
    background_gradient: null,
    background_image: null,
    background_overlay: null,
    text_color: '#4b5563', // text-gray-600
    heading_color: '#111827', // text-gray-900
    subheading_color: '#4b5563', // text-gray-600
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif', // font-display
    body_font: 'Inter, sans-serif',
    font_size_base: '16px',
    card_background: '#ffffff', // Form cards
    card_border_color: '#e5e7eb', // border-gray-200
    card_border_radius: '1rem', // rounded-2xl
    card_shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    card_text_color: '#111827', // text-gray-900
    button_background: '#06b6d4', // primary-600
    button_text_color: '#ffffff',
    button_hover_background: '#0891b2', // primary-700
  },
}

// Helper to get default styles for a section
export function getDefaultStyles(sectionKey: string): any {
  return DEFAULT_SECTION_STYLES[sectionKey] || {
    section_key: sectionKey,
    section_name: sectionKey,
    background_color: '#ffffff',
    text_color: '#4b5563',
    heading_color: '#111827',
    font_family: 'Inter, sans-serif',
    heading_font: 'Poppins, sans-serif',
    body_font: 'Inter, sans-serif',
  }
}

