import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: number
  trendLabel?: string
}

export function StatsCard({ title, value, icon: Icon, trend, trendLabel }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend !== undefined && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                  {trendLabel && (
                    <span className="ml-1 text-gray-500 font-normal">
                      {trendLabel}
                    </span>
                  )}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}