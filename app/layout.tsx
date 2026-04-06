import './globals.css'

// Root layout — html/body zitten hier
// [locale]/layout.tsx voegt Nav, Footer en i18n providers toe
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
