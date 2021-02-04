import React from 'react'
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react'

function Wrapper({ children }) {
  return <div>{children}</div>
}

function render(
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'queries' | 'wrapper'>,
): RenderResult {
  return rtlRender(ui, { wrapper: Wrapper as React.FC, ...options })
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export * from '@testing-library/jest-dom'
export { render }
