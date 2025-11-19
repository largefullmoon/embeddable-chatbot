'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import { clsx } from 'clsx'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Forms', href: '/user/forms' },
    { name: 'Leads', href: '/user/leads' },
    { name: 'Content Upload', href: '/user/content' },
    { name: 'Embed Code', href: '/user/embed' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/user/forms" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">
                  AI Form Builder
                </span>
                <span className="ml-2 text-sm text-gray-500">User Panel</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2',
                      pathname === item.href
                        ? 'border-primary-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-gray-300'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

