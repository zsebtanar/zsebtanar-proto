import React from 'react'
import { render } from '@testing-library/react'
import { Markdown } from 'client/generic/components/markdown/Markdown'

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
