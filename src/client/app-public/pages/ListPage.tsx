import React, { useLayoutEffect } from 'react'
import { PublicPage } from 'client/generic/components/PublicPage'
import { useQuery } from '../../generic/hooks/navigation'
import { CLASSIFICATION_PARAM } from '../../classification/values'
import { useLoadExercises } from '../../exercise/services/exercise'
import { Loading } from '../../generic/components/Loading'
import { ExerciseListItem } from 'client/exercise/components/ExerciseListItem'
import { Alert } from '../../generic/components/Alert'
import { ClassificationLink } from '../../classification/components/ClassificationLink'
import { Button } from '../../generic/components/Button'

export function ListPage(): JSX.Element {
  const query = useQuery()
  const classifications = (query.get(CLASSIFICATION_PARAM) ?? '').split(',')
  const { isLoading, hasNoResult, list, hasMore, next } = useLoadExercises({
    classifications,
  })

  useLayoutEffect(() => {
    if (!isLoading) return
    const currentTop = document.documentElement.scrollTop
    document.documentElement.scrollTo({ top: currentTop })
  }, [isLoading])

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

      {hasNoResult && <Alert type="info">Nincs elem a listában.</Alert>}
      {list?.length &&
        list?.map(({ id, classifications, description }) => (
          <ExerciseListItem
            key={id}
            id={id ?? ''}
            classifications={classifications}
            description={description}
          />
        ))}
      {isLoading && <Loading />}
      {!isLoading && hasMore && (
        <div className="text-center">
          <Button onAction={next}>Még</Button>
        </div>
      )}
    </PublicPage>
  )
}
;(ListPage as any).whyDidYouRender = true
