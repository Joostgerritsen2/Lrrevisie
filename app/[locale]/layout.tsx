import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export const metadata: Metadata = {
  title: { default: 'LR Revisie — Land Rover Specialist', template: '%s | LR Revisie' },
  description:
    'Vakkundige revisie van versnellingsbakken, tussenbakken, differentielen en stuurhuizen voor Land Rover en Range Rover.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </NextIntlClientProvider>
  )
}
