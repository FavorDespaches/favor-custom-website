import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/pt/dashboards/logistics',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(pt|en|fr|ar)',
        destination: '/:lang/dashboards/logistics',
        permanent: true,
        locale: false
      },
      {
        source: '/((?!(?:pt|en|fr|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/pt/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
