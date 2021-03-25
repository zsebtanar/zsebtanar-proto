import React from 'react'
import { useHistory, useParams } from 'react-router'
import { randomInt } from 'shared/utils/math'
import { useLoadExercise } from '../services/exercise'
import { Exercise } from '../components/public/Exercise'
import { useQuery } from 'client/generic/hooks/navigation'
import { PublicPage } from 'client/generic/components/PublicPage'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'

export function ExercisePage(): JSX.Element {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const query = useQuery()
  const { isLoading, isSuccess, result, error } = useLoadExercise(id)
  const seed = parseInt(query.get('s') ?? '', 10) || randomInt() + 1

  const onClose = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      history.push('/')
    }
  }

  if (error?.['status'] === 404) {
    history.replace('/page-not-found')
  }

  return (
    <PublicPage storePosition={false}>
      {isLoading && <Loading />}
      {error && (
        <Alert type="danger">
          <pre>{JSON.stringify(error, null, 3)}</pre>
        </Alert>
      )}
      {isSuccess && result && <Exercise seed={seed} exercise={result} onClose={onClose} />}
    </PublicPage>
  )
}
