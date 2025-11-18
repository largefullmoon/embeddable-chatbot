import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/components/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Form Builder - Conversational Forms with Intelligence',
  description: 'Create intelligent, conversational forms powered by AI to capture better leads',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

