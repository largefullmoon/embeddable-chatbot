'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { formsApi, FormField } from '@/lib/api'
import { formTemplates } from '@/lib/templates'
import toast from 'react-hot-toast'
import { FormBuilder } from '@/components/forms/FormBuilder'
import { TemplateSelector } from '@/components/forms/TemplateSelector'

export default function NewFormPage() {
  const router = useRouter()
  const [step, setStep] = useState<'template' | 'builder'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: any) => formsApi.create(data),
    onSuccess: (response) => {
      toast.success('Form created successfully')
      router.push(`/user/forms/${response.data.id}`)
    },
    onError: () => {
      toast.error('Failed to create form')
    },
  })

  const handleTemplateSelect = (templateId: string | null) => {
    setSelectedTemplate(templateId)
    setStep('builder')
  }

  const handleFormSubmit = (formData: any) => {
    createMutation.mutate(formData)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Create New Form</h1>
        <p className="mt-2 text-sm text-gray-700">
          {step === 'template'
            ? 'Choose a template to get started quickly, or start from scratch'
            : 'Customize your form fields, context, and settings'}
        </p>
      </div>

      {step === 'template' ? (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onBack={() => router.push('/user/forms')}
        />
      ) : (
        <FormBuilder
          templateId={selectedTemplate}
          onSubmit={handleFormSubmit}
          onCancel={() => router.push('/user/forms')}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  )
}

