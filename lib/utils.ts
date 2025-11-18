import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function getEmbedCode(formId: string, appUrl: string): string {
  return `<!-- AI Form Builder Widget -->
<div id="ai-form-${formId}"></div>
<script src="${appUrl}/embed.js"></script>
<script>
  AIFormBuilder.init({
    formId: '${formId}',
    containerId: 'ai-form-${formId}'
  });
</script>`
}

export function getPopupEmbedCode(formId: string, appUrl: string): string {
  return `<!-- AI Form Builder Popup -->
<button id="ai-form-trigger-${formId}">Open Form</button>
<script src="${appUrl}/embed.js"></script>
<script>
  AIFormBuilder.initPopup({
    formId: '${formId}',
    triggerId: 'ai-form-trigger-${formId}'
  });
</script>`
}

