import React from 'react'

import { PublicPage } from 'client/generic/components/PublicPage'
import { Markdown } from '../../generic/components/markdown/Markdown'

export function Privacy(): JSX.Element {
  return (
    <PublicPage>
      <div className="mx-auto">
        <div className="container">
          <Markdown
            source={`
## Adatvédelmi nyilatkozat

### 1. Point

Szöveg
            `}
          />
        </div>
      </div>
    </PublicPage>
  )
}
