import React, { useLayoutEffect } from 'react'
import { PublicPage } from 'client/generic/components/PublicPage'
import { useQuery } from '../../generic/hooks/navigation'
import { CLASSIFICATION_PARAM } from '../../classification/values'
import { useLoadExercisesSummary } from '../../exercise/services/exercise'
import { Loading } from '../../generic/components/Loading'
import { ExerciseListItem } from 'client/exercise/components/ExerciseListItem'
import { Alert } from '../../generic/components/Alert'
import { ClassificationLink } from '../../classification/components/ClassificationLink'
import { Button } from '../../generic/components/Button'

import './ListPage.scss'

export function ListPage(): JSX.Element {
  const query = useQuery()
  const classifications = (query.get(CLASSIFICATION_PARAM) ?? '').split(',')

  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0 })
  }, [classifications])

  return <ListPageContent key={classifications.join()} classifications={classifications} />
}

function ListPageContent({ classifications }) {
  const { isLoading, hasNoResult, list, hasMore, next } = useLoadExercisesSummary({
    classifications,
  })

  useLayoutEffect(() => {
    if (!isLoading) return
    document.documentElement.scrollTo({ top: document.documentElement.scrollTop })
  }, [isLoading])

  return (
    <PublicPage className="list-page" addToBackJourney>
      <h2 className="mb-5">
        <small>
          Az összes{' '}
          {classifications.map((cls) => (
            <ClassificationLink key={cls} classificationKey={cls} />
          ))}{' '}
          címkével megjelölt feladat:
        </small>
        <hr />
      </h2>

      {hasNoResult && <Alert type="info">Nincs elem a listában.</Alert>}
      {list?.length
        ? list?.map(({ id, classifications, description }) => (
            <ExerciseListItem
              key={id}
              id={id ?? ''}
              classifications={classifications}
              description={description}
            />
          ))
        : ''}
      {isLoading && <Loading />}
      {!isLoading && hasMore && (
        <div className="text-center">
          <Button onAction={next}>Még</Button>
        </div>
      )}
    </PublicPage>
  )
}
ListPage['whyDidYouRender'] = true
