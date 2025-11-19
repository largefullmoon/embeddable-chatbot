'use client'

import { useQuery } from '@tanstack/react-query'
import { leadsApi, Lead } from '@/lib/api'
import { formatDateTime, downloadBlob } from '@/lib/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function LeadsPage() {
  const [selectedFormId, setSelectedFormId] = useState<string | undefined>()

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads', selectedFormId],
    queryFn: async () => {
      const response = await leadsApi.getAll(selectedFormId)
      return response.data
    },
  })

  const handleExport = async () => {
    if (!selectedFormId) {
      toast.error('Please select a form first')
      return
    }

    try {
      const response = await leadsApi.exportCsv(selectedFormId)
      downloadBlob(response.data, `leads-${selectedFormId}-${Date.now()}.csv`)
      toast.success('Leads exported successfully')
    } catch (error) {
      toast.error('Failed to export leads')
    }
  }

  const getQualificationBadge = (level: string) => {
    const colors = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-blue-100 text-blue-800',
    }
    return colors[level as keyof typeof colors] || colors.cold
  }

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
          <h1 className="text-3xl font-semibold text-gray-900">Leads</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all your form submissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleExport}
            disabled={!selectedFormId}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="text-center mt-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leads yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start collecting leads by embedding your forms on your website.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contact
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Qualification
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Pain Points
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Buying Signals
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="font-medium text-gray-900">
                            {lead.contact_info.name || 'Anonymous'}
                          </div>
                          <div className="text-gray-500">{lead.contact_info.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getQualificationBadge(
                              lead.qualification_level
                            )}`}
                          >
                            {lead.qualification_level}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {lead.pain_points.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {lead.pain_points.slice(0, 2).map((point, i) => (
                                <li key={i} className="truncate max-w-xs">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">None identified</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {lead.buying_signals.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {lead.buying_signals.slice(0, 2).map((signal, i) => (
                                <li key={i} className="truncate max-w-xs">
                                  {signal}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">None detected</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDateTime(lead.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

