import React from 'react'
import { PublicPage } from 'client/generic/components/PublicPage'
import { useQuery } from '../../generic/hooks/navigation'
import { CLASSIFICATION_PARAM } from '../../categories/values'
import { useLoadExercises } from '../../exercise/services/exercise'
import { Loading } from '../../generic/components/Loading'
import { NavLink } from 'react-router-dom'
import { Markdown } from '../../generic/components/markdown/Markdown'
import { ClassificationLinkList } from 'client/categories/components/ClassificationLinkList'

export function ListPage(): JSX.Element {
  const query = useQuery()
  const classifications = (query.get(CLASSIFICATION_PARAM) ?? '').split(',')

  const { isLoading, isSuccess, hasNoResult, result } = useLoadExercises({
    classifications,
  })

  return (
    <PublicPage className="list-page">
      <h1>Faldatok</h1>
      {isLoading && <Loading />}
      {hasNoResult}
      {isSuccess && (
        <ol>
          {result?.map((exercise) => (
            <li key={exercise.id} className="mb-2">
              <NavLink
                to={`/exercise/${exercise.id}`}
                className="list-group-item list-group-item-action d-flex flex-column align-items-start"
              >
                <div className="mb-1 d-flex w-100 ">
                  <Markdown source={exercise.description} />
                </div>
              </NavLink>
              <ClassificationLinkList classifications={exercise.classifications} />
            </li>
          ))}
        </ol>
      )}
    </PublicPage>
  )
}
