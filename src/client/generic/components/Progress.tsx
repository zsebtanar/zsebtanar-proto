import React from 'react'

interface ProgressBarProps {
  className?: string
  value: number
  min?: number
  max?: number
}

export function ProgressBar({ min, max, className, value }: ProgressBarProps): JSX.Element {
  const style = { width: `${value}%` }
  return (
    <div className={`progress ${className || ''}`}>
      <div
        className="progress-bar"
        role="progressbar"
        style={style}
        aria-valuenow={value}
        aria-valuemin={min || 0}
        aria-valuemax={max || 100}
      />
    </div>
  )
}
