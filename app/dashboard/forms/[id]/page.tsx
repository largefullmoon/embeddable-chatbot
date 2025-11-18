'use client'

import { useQuery } from '@tanstack/react-query'
import { formsApi } from '@/lib/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { getEmbedCode, getPopupEmbedCode, copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ClipboardDocumentIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function FormDetailPage() {
  const params = useParams()
  const formId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'embed'>('overview')

  const { data: form, isLoading } = useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const response = await formsApi.getById(formId)
      return response.data
    },
  })

  const handleCopyEmbed = () => {
    const code = form?.embed_settings.position === 'inline'
      ? getEmbedCode(formId, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      : getPopupEmbedCode(formId, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    
    copyToClipboard(code)
    toast.success('Embed code copied to clipboard!')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!form) {
    return <div>Form not found</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-sm text-gray-700">{form.description}</p>
          )}
        </div>
        <Link
          href={`/dashboard/forms/${formId}/edit`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Form
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`${
              activeTab === 'embed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Embed Code
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Form Fields */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
            <div className="space-y-3">
              {form.fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{field.label}</span>
                    <span className="ml-2 text-sm text-gray-500">({field.type})</span>
                    {field.required && (
                      <span className="ml-2 text-xs text-red-600">Required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Context */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">AI Context</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {form.context}
            </pre>
          </div>

          {/* Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Embed Settings</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {form.embed_settings.position}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Button Text</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {form.embed_settings.button_text}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Primary Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: form.embed_settings.primary_color }}
                  />
                  <span className="text-sm text-gray-900">
                    {form.embed_settings.primary_color}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Width</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {form.embed_settings.width}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'embed' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Embed Code</h2>
            <button
              onClick={handleCopyEmbed}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
              Copy Code
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Copy and paste this code into your website where you want the form to appear.
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {form.embed_settings.position === 'inline'
              ? getEmbedCode(formId, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
              : getPopupEmbedCode(formId, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}
          </pre>
        </div>
      )}
    </div>
  )
}

