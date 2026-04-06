import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'

const locales = ['nl', 'en']

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

  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
