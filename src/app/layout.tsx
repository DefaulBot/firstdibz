import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import './globals.css'
import { ClientShell } from '@/components/ClientShell'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "Firs' Dibs BZ",
  description: 'Pay half now. Pay the rest later. Browse and preorder products in Belize.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-[var(--font-poppins)]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
