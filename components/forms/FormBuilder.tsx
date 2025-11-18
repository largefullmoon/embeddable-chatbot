'use client'

import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FormField } from '@/lib/api'
import { getTemplateById } from '@/lib/templates'
import { generateId } from '@/lib/utils'
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface FormBuilderProps {
  templateId?: string | null
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function FormBuilder({
  templateId,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FormBuilderProps) {
  const template = templateId ? getTemplateById(templateId) : null

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: template?.name || '',
      description: '',
      cta_type: template?.cta_type || 'Submit',
      fields: template?.fields || [],
      context: template?.context || '',
      embed_settings: {
        primary_color: '#0ea5e9',
        button_text: 'Start Chat',
        position: 'inline',
        width: '100%',
      },
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'fields',
  })

  const addField = (type: string) => {
    append({
      id: generateId(),
      type,
      label: '',
      placeholder: '',
      required: false,
      options: type === 'dropdown' || type === 'radio' ? [''] : undefined,
      order: fields.length,
    })
  }

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Form Title *
            </label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
              placeholder="Strategy Call Booking"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
              placeholder="Book a free 30-minute strategy session"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CTA Type *
            </label>
            <input
              type="text"
              {...register('cta_type', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
              placeholder="Book a Call"
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Form Fields</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addField('text')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Text
            </button>
            <button
              type="button"
              onClick={() => addField('email')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Email
            </button>
            <button
              type="button"
              onClick={() => addField('phone')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Phone
            </button>
            <button
              type="button"
              onClick={() => addField('dropdown')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Dropdown
            </button>
            <button
              type="button"
              onClick={() => addField('radio')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Radio
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    {(field as any).type}
                  </span>
                  <input
                    type="checkbox"
                    {...register(`fields.${index}.required`)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-600">Required</label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => index > 0 && move(index, index - 1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => index < fields.length - 1 && move(index, index + 1)}
                    disabled={index === fields.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  {...register(`fields.${index}.label`)}
                  placeholder="Field Label"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
                />
                <input
                  type="text"
                  {...register(`fields.${index}.placeholder`)}
                  placeholder="Placeholder"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
                />
              </div>

              {((field as any).type === 'dropdown' || (field as any).type === 'radio') && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options (one per line)
                  </label>
                  <textarea
                    {...register(`fields.${index}.options`)}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    onChange={(e) => {
                      const options = e.target.value.split('\n').filter(o => o.trim())
                      setValue(`fields.${index}.options`, options as any)
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fields added yet. Click the buttons above to add form fields.
            </div>
          )}
        </div>
      </div>

      {/* AI Context */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">AI Context</h2>
        <p className="text-sm text-gray-600 mb-4">
          Provide context about your offer, product, or service. This helps the AI have
          more intelligent conversations with your leads.
        </p>
        <textarea
          {...register('context')}
          rows={10}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2 font-mono text-sm"
          placeholder="Example:&#10;&#10;You are a helpful sales assistant for [Company Name].&#10;&#10;Our product: [Description]&#10;Target audience: [Who you serve]&#10;Key benefits: [Main value propositions]&#10;Common objections: [How to handle them]&#10;&#10;Your goal is to qualify leads and book strategy calls."
        />
      </div>

      {/* Embed Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Embed Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              {...register('embed_settings.primary_color')}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Button Text
            </label>
            <input
              type="text"
              {...register('embed_settings.button_text')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <select
              {...register('embed_settings.position')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
            >
              <option value="inline">Inline</option>
              <option value="popup">Popup</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              type="text"
              {...register('embed_settings.width')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
              placeholder="100% or 600px"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Form'}
        </button>
      </div>
    </form>
  )
}

