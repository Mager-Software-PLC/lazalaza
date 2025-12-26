// Server component wrapper for static export
import ServiceEditClient from './ServiceEditClient'

// Required for static export - returns empty array since admin pages are client-side only
export async function generateStaticParams() {
  return []
}

export default function ServiceEditPage() {
  return <ServiceEditClient />
}
