// Server component wrapper for static export
import ServiceDetailClient from './ServiceDetailClient'

// Required for static export - returns empty array since pages are client-side rendered
export async function generateStaticParams() {
  return []
}

export default function ServiceDetailPage() {
  return <ServiceDetailClient />
}
