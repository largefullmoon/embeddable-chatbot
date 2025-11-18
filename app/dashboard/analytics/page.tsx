'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api'
import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AnalyticsPage() {
  const [selectedFormId, setSelectedFormId] = useState<string>('')

  const { data: dashboardStats } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const response = await analyticsApi.getDashboardStats()
      return response.data
    },
  })

  const { data: formAnalytics } = useQuery({
    queryKey: ['analytics', 'form', selectedFormId],
    queryFn: async () => {
      if (!selectedFormId) return null
      const response = await analyticsApi.getFormAnalytics(selectedFormId)
      return response.data
    },
    enabled: !!selectedFormId,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track performance and engagement metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Views
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {dashboardStats?.total_views || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {dashboardStats?.total_completions || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completion Rate
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {dashboardStats?.completion_rate
                      ? `${(dashboardStats.completion_rate * 100).toFixed(1)}%`
                      : '0%'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Time
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {dashboardStats?.avg_completion_time
                      ? `${Math.round(dashboardStats.avg_completion_time)}s`
                      : '0s'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {formAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Questions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Questions Asked</h3>
            {formAnalytics.top_questions.length > 0 ? (
              <Bar
                data={{
                  labels: formAnalytics.top_questions.map((q) => q.question),
                  datasets: [
                    {
                      label: 'Count',
                      data: formAnalytics.top_questions.map((q) => q.count),
                      backgroundColor: 'rgba(14, 165, 233, 0.5)',
                      borderColor: 'rgba(14, 165, 233, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet</p>
            )}
          </div>

          {/* Common Objections */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Common Objections</h3>
            {formAnalytics.common_objections.length > 0 ? (
              <ul className="space-y-3">
                {formAnalytics.common_objections.map((objection, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{objection.objection}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {objection.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

