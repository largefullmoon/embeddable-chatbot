'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formsApi, chatApi, ChatMessage } from '@/lib/api'
import { generateId } from '@/lib/utils'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface ChatWidgetProps {
  formId: string
}

export function ChatWidget({ formId }: ChatWidgetProps) {
  const [sessionId] = useState(() => generateId())
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState<'chat' | 'form' | 'complete'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: form } = useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const response = await formsApi.getById(formId)
      return response.data
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      chatApi.sendMessage(formId, sessionId, message, formData),
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // Check if we should show form
      if (response.data.show_form) {
        setCurrentStep('form')
      }
    },
  })

  const submitFormMutation = useMutation({
    mutationFn: (data: any) => chatApi.submitForm(formId, sessionId, data),
    onSuccess: () => {
      setCurrentStep('complete')
    },
  })

  useEffect(() => {
    if (form) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hi! I'm here to help you with ${form.title}. ${
          form.description || ''
        } Feel free to ask me any questions!`,
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [form])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    sendMessageMutation.mutate(input)
    setInput('')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitFormMutation.mutate(formData)
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
      style={{ height: '600px' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 text-white"
        style={{ backgroundColor: form.embed_settings.primary_color }}
      >
        <h2 className="text-xl font-semibold">{form.title}</h2>
        {form.description && (
          <p className="text-sm opacity-90 mt-1">{form.description}</p>
        )}
      </div>

      {currentStep === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={
                    message.role === 'user'
                      ? { backgroundColor: form.embed_settings.primary_color }
                      : {}
                  }
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || sendMessageMutation.isPending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: form.embed_settings.primary_color }}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </>
      )}

      {currentStep === 'form' && (
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4">
            Please fill out the following information:
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : field.type === 'dropdown' ? (
                  <select
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="space-y-2">
                    {field.options?.map((option, i) => (
                      <label key={i} className="flex items-center">
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          required={field.required}
                          checked={formData[field.id] === option}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitFormMutation.isPending}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
              style={{ backgroundColor: form.embed_settings.primary_color }}
            >
              {submitFormMutation.isPending ? 'Submitting...' : form.cta_type}
            </button>
          </form>
        </div>
      )}

      {currentStep === 'complete' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              We've received your submission and will get back to you soon.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

