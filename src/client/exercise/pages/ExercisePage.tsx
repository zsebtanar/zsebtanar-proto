import React from 'react'
import { useParams, useHistory } from 'react-router'
import { randomInt } from 'shared/utils/math'
import { useLoadExercise } from '../services/exercise'
import { Exercise } from '../components/Exercise'
import { useQuery } from 'client/generic/hooks/navigation'
import { PublicPage } from 'client/generic/components/PublicPage'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'

export function ExercisePage(): JSX.Element {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const query = useQuery()
  const { isLoading, isSuccess, result, error } = useLoadExercise(id)
  const seed = parseInt(query.get('s') ?? '', 10) || randomInt()

  const onClose = () => {
    if (window.history.length > 1) {
      history.back()
    } else {
      history.push('/')
    }
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
