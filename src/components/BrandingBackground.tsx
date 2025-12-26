import { useEffect } from 'react'
import { useCMS } from '@/contexts/CMSContext'

export default function BrandingBackground() {
  const { settings, loading } = useCMS()

  // Apply color function
  const applyColor = (color: string) => {
    if (typeof document !== 'undefined' && color) {
      console.log('Applying branding color:', color)
      // Apply to document root as CSS variable
      document.documentElement.style.setProperty('--branding-background', color)
      
      // Apply to html element background (works with both light and dark mode)
      document.documentElement.style.backgroundColor = color
      document.documentElement.style.setProperty('background-color', color, 'important')
      
      // Store in localStorage for persistence
      localStorage.setItem('branding_background_color', color)
    }
  }

  // Apply immediately on mount from localStorage (for instant effect)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedColor = localStorage.getItem('branding_background_color')
    if (savedColor) {
      applyColor(savedColor)
      // Force a re-render of sections by dispatching a custom event
      window.dispatchEvent(new CustomEvent('brandingColorChanged', { detail: { color: savedColor } }))
    }

    // Listen for theme change events from admin page
    const handleThemeChange = (e: CustomEvent) => {
      const color = e.detail?.color
      if (color) {
        applyColor(color)
        // Notify sections to update
        window.dispatchEvent(new CustomEvent('brandingColorChanged', { detail: { color } }))
      }
    }

    window.addEventListener('themeColorChanged' as any, handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('themeColorChanged' as any, handleThemeChange as EventListener)
    }
  }, [])

  // Apply when settings load from CMS
  useEffect(() => {
    if (loading) return

    // Get branding background color from settings
    const brandingColor = settings?.branding_background_color || 
                         settings?.theme_background_color ||
                         localStorage.getItem('branding_background_color') ||
                         ''

    if (brandingColor) {
      applyColor(brandingColor)
    } else {
      // Default: remove custom background if no theme is set
      if (typeof document !== 'undefined') {
        document.documentElement.style.backgroundColor = ''
        document.documentElement.style.removeProperty('--branding-background')
      }
    }
  }, [settings, loading])

  return null
}

