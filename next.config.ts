import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [85, 60],
    minimumCacheTTL: 31536000, // 1 jaar
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 400],
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'lr-revisie.nl' },
      { hostname: 'assets.mixkit.co' },
      { hostname: 'cdn.coverr.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/over-landrover-revisie', destination: '/nl/over-ons', permanent: true },
      { source: '/veel-gestelde-vragen', destination: '/nl/faq', permanent: true },
      { source: '/privacybeleid', destination: '/nl/privacy', permanent: true },
      { source: '/versnellingsbak-identificatie', destination: '/nl/gidsen/versnellingsbak-identificatie', permanent: true },
      { source: '/overzicht-van-versnellingsbakken', destination: '/nl/gidsen/overzicht-versnellingsbakken', permanent: true },
      { source: '/rover-v8-motor-nummers', destination: '/nl/gidsen/rover-v8-motor-nummers', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
