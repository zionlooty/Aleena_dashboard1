import React from 'react'
import { Spin } from 'antd'

const LoadingSpinner = ({ size = 'default', tip = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Spin size={size} tip={tip}>
        <div className="w-full h-32 bg-transparent rounded-lg"></div>
      </Spin>
    </div>
  )
}

export default LoadingSpinner
