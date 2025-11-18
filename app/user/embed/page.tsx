'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { formsApi, Form } from '@/lib/api'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function EmbedPage() {
  const searchParams = useSearchParams()
  const formIdParam = searchParams.get('formId')
  const [selectedFormId, setSelectedFormId] = useState<string>(formIdParam || '')
  const [embedType, setEmbedType] = useState<'inline' | 'popup'>('inline')
  const [copied, setCopied] = useState(false)

  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await formsApi.getAll()
      return response.data
    },
  })

  const selectedForm = forms?.find((f: Form) => f.id === selectedFormId)

  const generateEmbedCode = () => {
    if (!selectedFormId) return ''

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (embedType === 'inline') {
      return `<!-- AI Form Builder Embed Code -->
<div id="ai-form-${selectedFormId}"></div>
<script src="${appUrl}/embed.js"></script>
<script>
  AIFormBuilder.init({
    formId: '${selectedFormId}',
    containerId: 'ai-form-${selectedFormId}'
  });
</script>`
    } else {
      return `<!-- AI Form Builder Popup Code -->
<button id="ai-form-trigger-${selectedFormId}" style="padding: 12px 24px; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
  Open Form
</button>
<script src="${appUrl}/embed.js"></script>
<script>
  AIFormBuilder.initPopup({
    formId: '${selectedFormId}',
    triggerId: 'ai-form-trigger-${selectedFormId}'
  });
</script>`
    }
  }

  const handleCopy = () => {
    const code = generateEmbedCode()
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Embed code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Embed Code Generator</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate embed code to add your conversational forms to any website
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configuration</h2>

            {/* Form Selection */}
            <div className="mb-6">
              <label htmlFor="form-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Form
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading forms...</div>
              ) : forms && forms.length > 0 ? (
                <select
                  id="form-select"
                  value={selectedFormId}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Choose a form...</option>
                  {forms.map((form: Form) => (
                    <option key={form.id} value={form.id}>
                      {form.title}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  No forms available. <a href="/user/forms/new" className="text-primary-600 hover:text-primary-500">Create one first</a>
                </p>
              )}
            </div>

            {/* Embed Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Embed Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inline"
                    checked={embedType === 'inline'}
                    onChange={(e) => setEmbedType('inline')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Inline Embed</span>
                    <span className="block text-gray-500">Display form directly on your page</span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="popup"
                    checked={embedType === 'popup'}
                    onChange={(e) => setEmbedType('popup')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Popup Modal</span>
                    <span className="block text-gray-500">Show form in a modal when button is clicked</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Selected Form Info */}
            {selectedForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Selected Form</h3>
                <p className="text-sm text-gray-700 font-medium">{selectedForm.title}</p>
                {selectedForm.description && (
                  <p className="text-xs text-gray-500 mt-1">{selectedForm.description}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Preview Panel */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Embed Code</h2>
            <button
              onClick={handleCopy}
              disabled={!selectedFormId}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </button>
          </div>

          {selectedFormId ? (
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
                <code>{generateEmbedCode()}</code>
              </pre>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-500">
                Select a form to generate embed code
              </p>
            </div>
          )}

          {/* Instructions */}
          {selectedFormId && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">How to use</h3>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Copy the embed code above</li>
                <li>Paste it into your website's HTML where you want the form to appear</li>
                <li>The form will load automatically when the page is viewed</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {selectedFormId && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
          <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50">
            {embedType === 'inline' ? (
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500 text-center">
                  Your inline form would appear here on your website
                </p>
              </div>
            ) : (
              <div className="text-center">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Open Form
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Click the button to open the form in a modal
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

