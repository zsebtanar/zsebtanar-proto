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
  const filtered = Object.entries<string>(result || {})
    .filter(([key]) => !rootCategory || key.startsWith(rootCategory))
    .sort(sortByProp(0))

  if (!filtered.length) {
    return null
  }

  return (
    <div className="classification-selector">
      {title && <h2>{title}</h2>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
        {filtered.map(([key, label]) => (
          <div className="col" key={key}>
            <NavLink to={toClassificationList(key)}>{label}</NavLink>
          </div>
        ))}
      </div>
    </div>
  )
}
