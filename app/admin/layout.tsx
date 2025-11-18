'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import { getUserRole } from '@/lib/roles'
import { clsx } from 'clsx'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading && !user) {
        router.push('/')
        return
      }

      if (user) {
        const role = await getUserRole()
        if (role !== 'admin') {
          router.push('/user')
          return
        }
        setIsAdmin(true)
        setCheckingRole(false)
      }
    }

    checkAdminAccess()
  }, [user, loading, router])

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const navigation = [
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'All Forms', href: '/admin/forms' },
    { name: 'All Users', href: '/admin/users' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin/analytics" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">
                  AI Form Builder
                </span>
                <span className="ml-2 text-sm px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                  Admin
                </span>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/user/forms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Switch to User Panel
              </Link>
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

