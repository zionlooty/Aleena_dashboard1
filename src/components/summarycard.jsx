import React from 'react'
import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

const SummaryCard = ({
  icon,
  count,
  title,
  subtitle,
  trend,
  trendValue,
  color = 'blue',
  loading = false
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <Card
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
      loading={loading}
      bodyStyle={{ padding: '24px' }}
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-bl-full`}></div>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {icon && (
              <div className={`w-12 h-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
                {React.cloneElement(icon, { className: 'text-xl' })}
              </div>
            )}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
              <p className="text-gray-400 text-xs">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <Statistic
              value={count}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1f2937'
              }}
            />

            {trend && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <ArrowUpOutlined className="text-green-500 text-xs" />
                ) : (
                  <ArrowDownOutlined className="text-red-500 text-xs" />
                )}
                <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trendValue}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SummaryCard