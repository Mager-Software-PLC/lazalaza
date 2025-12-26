import { useEffect } from 'react'
import { useCMS } from '@/contexts/CMSContext'

export default function CMSColorVariables() {
  const { colors } = useCMS()

  useEffect(() => {
    if (typeof document !== 'undefined' && colors) {
      const root = document.documentElement
      
      // Apply CMS colors as CSS variables
      Object.entries(colors).forEach(([name, value]) => {
        // Convert color names to CSS variable format
        // e.g., "primary-600" -> "--color-primary-600"
        const cssVarName = `--color-${name.replace(/_/g, '-')}`
        root.style.setProperty(cssVarName, value as string)
        
        // Also create Tailwind-compatible variables for common colors
        // This allows using colors in className like "bg-[var(--primary-600)]"
        if (name.includes('-')) {
          const parts = name.split('-')
          const baseName = parts[0]
          const shade = parts.slice(1).join('-')
          
          // Set base color variable
          if (parts.length === 2 && /^\d+$/.test(parts[1])) {
            // e.g., primary-600 -> --primary-600
            root.style.setProperty(`--${baseName}-${shade}`, value as string)
          }
        }
      })
    }
  }, [colors])

  return null
}

