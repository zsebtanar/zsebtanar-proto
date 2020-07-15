import React from 'react'
import { ClassificationLink } from './ClassificationLink'

interface Props {
  classifications: string[]
}

export function ClassificationLinkList({ classifications }: Props): JSX.Element {
  return (
    <React.Fragment>
      {classifications.sort().map((cls) => (
        <React.Fragment key={cls}>
          <ClassificationLink classificationKey={cls} />{' '}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
