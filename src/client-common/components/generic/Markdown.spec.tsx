import React from 'react'
import { render } from '@testing-library/react'
import { Markdown } from './Markdown'

test('Markdown should render', async () => {
  const { asFragment } = render(<Markdown source="# hello>" />)

  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="markdown "
      />
    </DocumentFragment>
  `)
})
