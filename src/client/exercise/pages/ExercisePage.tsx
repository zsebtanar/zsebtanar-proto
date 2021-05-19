import React from 'react'
import { useHistory, useParams } from 'react-router'
import { randomInt } from 'shared/utils/math'
import { SEED_RANGE } from 'shared/math/constatns'
import { useLoadExercise } from '../services/exercise'
import { Exercise } from '../components/public/Exercise'
import { useQuery } from 'client/generic/hooks/navigation'
import { PublicPage } from 'client/generic/components/PublicPage'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { useBackJourney } from '../../generic/providers/BackJourneyProvider'

export function ExercisePage(): JSX.Element {
  const history = useHistory()
  const bj = useBackJourney()
  const { id } = useParams<{ id: string }>()
  const query = useQuery()
  const { isLoading, isSuccess, result, error } = useLoadExercise(id)
  const seed = parseInt(query.get('s') ?? '', 10) || randomInt(SEED_RANGE) + 1

  const onClose = () => {
    bj.back(true)
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
