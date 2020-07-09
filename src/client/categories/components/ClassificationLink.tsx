import React from 'react'
import { Link } from '../../generic/components/Link'
import { toClassificationList, classificationBadgeType } from '../utils'
import { useClassification } from '../provider/ClassificationProvider'

interface Props {
  classificationKey: string
}

export function ClassificationLink({ classificationKey }: Props): JSX.Element {
  const { result: classifications } = useClassification()

  return (
    <Link
      type="light"
      to={toClassificationList(classificationKey)}
      badge={classificationBadgeType(classificationKey)}
    >
      {classifications?.[classificationKey]}
    </Link>
  )
}
