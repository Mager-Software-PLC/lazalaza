import { useLocation } from 'react-router-dom'
import { ThemeProvider } from './ThemeProvider'
import { CMSProvider } from '@/contexts/CMSContext'
import Navbar from './Navbar'
import Footer from './Footer'
import StickyCTA from './StickyCTA'
import CMSColorVariables from './CMSColorVariables'
import BrandingBackground from './BrandingBackground'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAdminPage = location.pathname?.startsWith('/admin')

  return (
    <ThemeProvider>
      <CMSProvider>
        <CMSColorVariables />
        <BrandingBackground />
        {!isAdminPage && <Navbar />}
        <main className="min-h-screen">
          {children}
        </main>
        {!isAdminPage && <StickyCTA />}
        {!isAdminPage && <Footer />}
      </CMSProvider>
    </ThemeProvider>
  )
}

