import { motion } from 'framer-motion'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  data: ChartData[]
  type?: 'bar' | 'line' | 'pie'
  height?: number
  showLabels?: boolean
}

export default function SimpleChart({ 
  data, 
  type = 'bar', 
  height = 200,
  showLabels = true 
}: SimpleChartProps) {
  // Validate and filter data
  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value) && isFinite(d.value))
  
  if (!validData || validData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 dark:text-gray-500" style={{ height: `${height}px` }}>
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...validData.map(d => d.value), 1)
  const colors = [
    'from-primary-500 to-ocean-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-accent-500 to-orange-500',
    'from-gold-500 to-yellow-500',
  ]

  if (type === 'bar') {
    return (
      <div className="w-full" style={{ height: `${height}px` }}>
        <div className="flex items-end justify-between h-full gap-2">
          {validData.map((item, index) => {
            const barHeight = Math.max(0, Math.min(100, (item.value / maxValue) * 100))
            const colorClass = item.color || colors[index % colors.length]
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg shadow-lg relative group`}
                >
                  {showLabels && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {item.value}
                    </div>
                  )}
                </motion.div>
                {showLabels && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
                    {item.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (type === 'line') {
    const points = validData.map((item, index) => {
      const x = (index / (validData.length - 1 || 1)) * 100
      const y = Math.max(0, Math.min(100, 100 - (item.value / maxValue) * 100))
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="w-full" style={{ height: `${height}px` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
          />
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            points={points}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="1"
          />
          {validData.map((item, index) => {
            const x = (index / (validData.length - 1 || 1)) * 100
            const y = Math.max(0, Math.min(100, 100 - (item.value / maxValue) * 100))
            return (
              <motion.circle
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                cx={x}
                cy={y}
                r="2"
                fill="rgb(59, 130, 246)"
              />
            )
          })}
        </svg>
        {showLabels && (
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            {validData.map((item, index) => (
              <span key={index} className="truncate">{item.label}</span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Pie chart
  let currentAngle = 0
  const total = validData.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 dark:text-gray-500" style={{ height: `${height}px` }}>
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px]">
        {validData.map((item, index) => {
          const percentage = (item.value / total) * 100
          const angle = (percentage / 100) * 360
          const startAngle = currentAngle
          currentAngle += angle

          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = (currentAngle * Math.PI) / 180

          const x1 = 50 + 40 * Math.cos(startAngleRad)
          const y1 = 50 + 40 * Math.sin(startAngleRad)
          const x2 = 50 + 40 * Math.cos(endAngleRad)
          const y2 = 50 + 40 * Math.sin(endAngleRad)

          // Validate all values are numbers
          if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
            return null
          }

          const largeArcFlag = angle > 180 ? 1 : 0

          const pathData = [
            `M 50 50`,
            `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
            `Z`,
          ].join(' ')

          const colorClass = item.color || colors[index % colors.length]
          const [fromColor, toColor] = colorClass.split(' to-')

          return (
            <motion.path
              key={item.label}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              d={pathData}
              fill={`url(#pieGradient${index})`}
              className="stroke-white dark:stroke-slate-900 stroke-1"
            >
              <defs>
                <linearGradient id={`pieGradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={fromColor.replace('from-', '')} />
                  <stop offset="100%" stopColor={toColor} />
                </linearGradient>
              </defs>
            </motion.path>
          )
        })}
      </svg>
      {showLabels && (
        <div className="ml-4 space-y-2">
          {validData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            const colorClass = item.color || colors[index % colors.length]
            return (
              <div key={item.label} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded bg-gradient-to-r ${colorClass}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}: {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

