'use client'

import { useState } from 'react'
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { documentsApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  formId: string
  onUploadComplete?: (documentId: string) => void
}

export function DocumentUpload({ formId, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ id: string; filename: string }>>([])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOCX, or TXT files.')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 10MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('form_id', formId)

      const response = await documentsApi.upload(formData)
      
      setUploadedDocs([...uploadedDocs, {
        id: response.data.id,
        filename: response.data.filename
      }])

      toast.success('Document uploaded and parsed successfully')
      
      if (onUploadComplete) {
        onUploadComplete(response.data.id)
      }
    } catch (error) {
      toast.error('Failed to upload document')
      console.error(error)
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
        <input
          type="file"
          id="document-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label
          htmlFor="document-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-700">
            {uploading ? 'Uploading...' : 'Upload Document'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PDF, DOCX, or TXT (max 10MB)
          </span>
        </label>
      </div>

      {uploadedDocs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
          {uploadedDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">{doc.filename}</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await documentsApi.delete(doc.id)
                    setUploadedDocs(uploadedDocs.filter(d => d.id !== doc.id))
                    toast.success('Document removed')
                  } catch (error) {
                    toast.error('Failed to remove document')
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

