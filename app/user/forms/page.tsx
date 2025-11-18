'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formsApi, Form } from '@/lib/api'
import { PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function UserFormsPage() {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await formsApi.getAll()
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => formsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      toast.success('Form deleted successfully')
      setDeletingId(null)
    },
    onError: () => {
      toast.error('Failed to delete form')
      setDeletingId(null)
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => formsApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      toast.success('Form duplicated successfully')
    },
    onError: () => {
      toast.error('Failed to duplicate form')
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Your Forms</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage your conversational forms
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/user/forms/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Form
          </Link>
        </div>
      </div>

      {!forms || forms.length === 0 ? (
        <div className="text-center mt-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new conversational form.
          </p>
          <div className="mt-6">
            <Link
              href="/user/forms/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {form.cta_type}
                  </span>
                </div>
                {form.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {form.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mb-4">
                  Created {formatDate(form.created_at)}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/user/forms/${form.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View Details →
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      href={`/user/embed?formId=${form.id}`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Get Embed Code"
                    >
                      <CodeBracketIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => duplicateMutation.mutate(form.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/user/forms/${form.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this form?')) {
                          setDeletingId(form.id)
                          deleteMutation.mutate(form.id)
                        }
                      }}
                      disabled={deletingId === form.id}
                      className="text-red-400 hover:text-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

