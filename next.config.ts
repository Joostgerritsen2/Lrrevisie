import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'lr-revisie.nl' },
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
