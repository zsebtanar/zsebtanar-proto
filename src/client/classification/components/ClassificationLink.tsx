import React from 'react'
import { Link } from '../../generic/components/Link'
import { toClassificationList } from '../utils'
import { useClassification } from '../provider/ClassificationProvider'

interface Props {
  classificationKey: string
}

export function ClassificationLink({ classificationKey }: Props): JSX.Element {
  const { result: classifications } = useClassification()

  return (
    <Link to={toClassificationList(classificationKey)} badge="light">
      {classifications?.map[classificationKey]?.label}
    </Link>
  )
}
