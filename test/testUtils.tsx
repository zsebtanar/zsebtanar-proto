import React from 'react'
import { render as rtlRender } from '@testing-library/react'

function Wrapper({ children }) {
  return <div>{children}</div>
}

function render(ui, options) {
  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/jest-dom'
export { render }
