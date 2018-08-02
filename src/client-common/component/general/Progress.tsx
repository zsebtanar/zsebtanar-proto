import * as React from 'react'

interface ProgressBarProps {
  className?: string
  value: number
  min?: number
  max?: number
}

export function ProgressBar(props: ProgressBarProps) {
  const style = { width: `${props.value}%` }
  return (
    <div className={`progress ${props.className || ''}`}>
      <div
        className="progress-bar"
        role="progressbar"
        style={style}
        aria-valuenow={props.value}
        aria-valuemin={props.min || 0}
        aria-valuemax={props.max || 100}
      />
    </div>
  )
}
