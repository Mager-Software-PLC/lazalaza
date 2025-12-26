import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '@/lib/api'

interface CMSData {
  settings: Record<string, any>
  content: Record<string, string>
  colors: Record<string, string>
  features: any[]
  hero: any
  sections: any[]
  sectionStyles: Record<string, any>
  navbarItems: any[]
  loading: boolean
  error: string | null
}

const CMSContext = createContext<CMSData>({
  settings: {},
  content: {},
  colors: {},
  features: [],
  hero: null,
  sections: [],
  sectionStyles: {},
  navbarItems: [],
  loading: true,
  error: null,
})

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>({
    settings: {},
    content: {},
    colors: {},
    features: [],
    hero: null,
    sections: [],
    sectionStyles: {},
    navbarItems: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    loadCMSData()
  }, [])

  const loadCMSData = async () => {
    try {
      const cmsData = await api.getAllCMSData()
      
      // Debug: Log section styles
      if (process.env.NODE_ENV === 'development') {
        console.log('[CMSContext] Loaded sectionStyles:', cmsData.sectionStyles)
      }
      
      setData({
        settings: cmsData.settings || {},
        content: cmsData.content || {},
        colors: cmsData.colors || {},
        features: cmsData.features || [],
        hero: cmsData.hero || null,
        sections: cmsData.sections || [],
        sectionStyles: cmsData.sectionStyles || {},
        navbarItems: cmsData.navbarItems || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      // Don't set error state - just use empty defaults so site still works
      setData({
        settings: {},
        content: {},
        colors: {},
        features: [],
        hero: null,
        sections: [],
        sectionStyles: {},
        navbarItems: [],
        loading: false,
        error: null, // Don't block site if CMS fails
      })
    }
  }

  return <CMSContext.Provider value={data}>{children}</CMSContext.Provider>
}

export function useCMS() {
  return useContext(CMSContext)
}

