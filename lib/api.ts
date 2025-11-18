import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token interceptor
api.interceptors.request.use(async (config) => {
  // Get Clerk token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('clerk_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Types
export interface Form {
  id: string
  user_id: string
  title: string
  description?: string
  cta_type: string
  fields: FormField[]
  context: string
  context_documents?: string[]
  template_type?: string
  embed_settings: EmbedSettings
  created_at: string
  updated_at: string
}

export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'dropdown' | 'radio' | 'textarea'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  order: number
}

export interface EmbedSettings {
  primary_color: string
  button_text: string
  position: 'inline' | 'popup'
  width: string
}

export interface Lead {
  id: string
  form_id: string
  contact_info: {
    name?: string
    email?: string
    phone?: string
  }
  responses: Record<string, any>
  conversation_history: ChatMessage[]
  pain_points: string[]
  buying_signals: string[]
  qualification_level: 'hot' | 'warm' | 'cold'
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Analytics {
  form_id: string
  total_views: number
  total_completions: number
  completion_rate: number
  drop_off_rate: number
  avg_completion_time: number
  top_questions: Array<{ question: string; count: number }>
  common_objections: Array<{ objection: string; count: number }>
}

// API Functions
export const formsApi = {
  getAll: () => api.get<Form[]>('/forms'),
  getById: (id: string) => api.get<Form>(`/forms/${id}`),
  create: (data: Partial<Form>) => api.post<Form>('/forms', data),
  update: (id: string, data: Partial<Form>) => api.put<Form>(`/forms/${id}`, data),
  delete: (id: string) => api.delete(`/forms/${id}`),
  duplicate: (id: string) => api.post<Form>(`/forms/${id}/duplicate`),
}

export const leadsApi = {
  getAll: (formId?: string) => 
    api.get<Lead[]>('/leads', { params: { form_id: formId } }),
  getById: (id: string) => api.get<Lead>(`/leads/${id}`),
  exportCsv: (formId: string) => 
    api.get(`/leads/export/${formId}`, { responseType: 'blob' }),
}

export const analyticsApi = {
  getFormAnalytics: (formId: string) => 
    api.get<Analytics>(`/analytics/forms/${formId}`),
  getDashboardStats: () => 
    api.get('/analytics/dashboard'),
}

export const chatApi = {
  sendMessage: (formId: string, sessionId: string, message: string, context: any) =>
    api.post(`/chat/${formId}`, { session_id: sessionId, message, context }),
  submitForm: (formId: string, sessionId: string, data: any) =>
    api.post(`/chat/${formId}/submit`, { session_id: sessionId, data }),
}

export const templatesApi = {
  getAll: () => api.get('/templates'),
  getById: (id: string) => api.get(`/templates/${id}`),
}

export const documentsApi = {
  upload: (formData: FormData) => 
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  parse: (documentId: string) => api.post(`/documents/${documentId}/parse`),
}

