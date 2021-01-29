import React from 'react'
import { NavLink } from 'react-router-dom'
import { sortByProp } from 'shared/utils/fn'
import { useClassification } from '../provider/ClassificationProvider'
import { toClassificationList } from '../utils'

interface Props {
  title?: string
  rootCategory?: string
}

export function ClassificationSelector({ title, rootCategory }: Props): JSX.Element | null {
  const { result } = useClassification()
  const filtered = (result?.list ?? [])
    .filter(
      ({ id, exerciseCount }) => exerciseCount && (!rootCategory || id?.startsWith(rootCategory)),
    )
    .sort(sortByProp('id'))

  if (!filtered.length) {
    return null
  }

  return (
    <div className="classification-selector">
      {title && <h2>{title}</h2>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
        {filtered.map(({ id, label }) => (
          <div className="col" key={id}>
            <NavLink to={toClassificationList(id ?? '')}>{label}</NavLink>
          </div>
        ))}
      </div>
    </div>
  )
}
