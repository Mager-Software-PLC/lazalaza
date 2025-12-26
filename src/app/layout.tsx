import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import ClientWrapper from '@/components/ClientWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'Laza International - Media and Communications',
  description: 'Committed to Serve . Inspired to Create. Media Services, Event Management, Multimedia Production, and Technology Solutions.',
  keywords: 'Media Services, Event Management, Multimedia Production, Advertising, Branding, Printing, Technology Solutions, Art and Culture Consultancy, Translation Services',
  openGraph: {
    title: 'Laza International - Media and Communications',
    description: 'Committed to Serve . Inspired to Create.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}

