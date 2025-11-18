'use client'

import { formTemplates } from '@/lib/templates'

interface TemplateSelectorProps {
  onSelect: (templateId: string | null) => void
  onBack: () => void
}

export function TemplateSelector({ onSelect, onBack }: TemplateSelectorProps) {
  return (
    <div className="max-w-5xl">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Blank Template */}
        <button
          onClick={() => onSelect(null)}
          className="text-left p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start from Scratch
          </h3>
          <p className="text-sm text-gray-600">
            Create a custom form with your own fields and settings
          </p>
        </button>

        {/* Template Options */}
        {formTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="text-left p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
          >
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-3">
              {template.cta_type}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

