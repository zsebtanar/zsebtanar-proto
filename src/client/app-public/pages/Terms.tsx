import React from 'react'

import { PublicPage } from 'client/generic/components/PublicPage'
import { Markdown } from '../../generic/components/markdown/Markdown'

export function Terms(): JSX.Element {
  return (
    <PublicPage>
      <div className="mx-auto">
        <div className="container">
          <Markdown
            source={`
## Felhasználási feltételek

### 1. Point

Szöveg
            `}
          />
        </div>
      </div>
    </PublicPage>
  )
}
