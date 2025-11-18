import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-primary-600">
                  AI Form Builder
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  Forms
                </Link>
                <Link
                  href="/dashboard/leads"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
                >
                  Leads
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
                >
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
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

