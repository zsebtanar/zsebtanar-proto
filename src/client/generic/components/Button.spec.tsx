import React from 'react'
import { render } from '@testing-library/react'
import { Button } from './Button'

test('Default Button', async () => {
  const { asFragment } = render(<Button />)
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <button
        class="btn btn-secondary"
        type="button"
      />
    </DocumentFragment>
  `)
})
