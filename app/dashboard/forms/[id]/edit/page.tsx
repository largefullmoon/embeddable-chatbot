'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formsApi } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import { FormBuilder } from '@/components/forms/FormBuilder'
import toast from 'react-hot-toast'

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const formId = params.id as string

  const { data: form, isLoading } = useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const response = await formsApi.getById(formId)
      return response.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => formsApi.update(formId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', formId] })
      toast.success('Form updated successfully')
      router.push(`/dashboard/forms/${formId}`)
    },
    onError: () => {
      toast.error('Failed to update form')
    },
  })

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
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Edit Form</h1>
        <p className="mt-2 text-sm text-gray-700">
          Make changes to your form configuration
        </p>
      </div>

      <FormBuilder
        initialData={form}
        onSubmit={(data) => updateMutation.mutate(data)}
        onCancel={() => router.push(`/dashboard/forms/${formId}`)}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}

