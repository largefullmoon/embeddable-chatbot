'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ChatWidget } from '@/components/widget/ChatWidget'

export default function WidgetPage() {
  const params = useParams()
  const formId = params.id as string

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ChatWidget formId={formId} />
    </div>
  )
}

