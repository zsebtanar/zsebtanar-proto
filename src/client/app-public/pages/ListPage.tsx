import React from 'react'
import { PublicPage } from 'client/generic/components/PublicPage'
import { useQuery } from '../../generic/hooks/navigation'
import { CLASSIFICATION_PARAM } from '../../classification/values'
import { useLoadExercises } from '../../exercise/services/exercise'
import { Loading } from '../../generic/components/Loading'
import { ExerciseListItem } from 'client/exercise/components/ExerciseListItem'
import { Alert } from '../../generic/components/Alert'
import { ClassificationLink } from '../../classification/components/ClassificationLink'

export function ListPage(): JSX.Element {
  const query = useQuery()
  const classifications = (query.get(CLASSIFICATION_PARAM) ?? '').split(',')
  const { isLoading, isSuccess, hasNoResult, result } = useLoadExercises({
    classifications,
  })

  return (
    <PublicPage className="list-page">
      <h2 className="mb-4">
        <small>
          Összes{' '}
          {classifications.map((cls) => (
            <ClassificationLink key={cls} classificationKey={cls} />
          ))}{' '}
          címkével megjelölt feladat:
        </small>
      </h2>

      {isLoading && <Loading />}
      {hasNoResult && <Alert type="info">Nincs elem a listában.</Alert>}
      {isSuccess &&
        result?.map(({ id, classifications, description }) => (
          <ExerciseListItem
            key={id}
            id={id ?? ''}
            classifications={classifications}
            description={description}
          />
        ))}
    </PublicPage>
  )
}
;(ListPage as any).whyDidYouRender = true
