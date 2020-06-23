import React from 'react'
import { useParams, useHistory } from 'react-router'
import { PublicPage, Loading, Alert } from 'client/generic/components'
import { useLoadExercise } from '../services/exercise'
import { Exercise } from '../components/Exercise'
import { useQuery } from '../../generic/hooks'
import { randomInt } from 'shared/utils/math'

export function ExercisePage() {
  const history = useHistory()
  const { id } = useParams()
  const query = useQuery()
  const { isLoading, isSuccess, result, error } = useLoadExercise(id)
  const seed = parseInt(query.get('s') ?? '', 10) || randomInt()

  const onClose = () => {
    if (history.length > 1) {
      history.goBack()
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
