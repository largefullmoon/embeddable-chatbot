'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { getUserRole } from '@/lib/roles'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading && user) {
        const role = await getUserRole()
        if (role === 'admin') {
          router.push('/admin/analytics')
        } else {
          router.push('/user/forms')
        }
      }
    }
    checkUserAndRedirect()
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600">AI Form Builder</div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setAuthMode('signin')
              setShowAuthModal(true)
            }}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup')
              setShowAuthModal(true)
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Turn Forms Into
            <span className="text-primary-600"> Conversations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Create intelligent, AI-powered forms that engage your leads naturally,
            understand their needs, and qualify them automatically.
          </p>
          <button
            onClick={() => {
              setAuthMode('signup')
              setShowAuthModal(true)
            }}
            className="px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all"
          >
            Start Building Free
          </button>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Forms that understand context and ask smart follow-up questions
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track conversions, drop-offs, and lead quality in real-time
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Easy Embed</h3>
              <p className="text-gray-600">
                Add to any website with a simple embed code or popup
              </p>
            </div>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}

