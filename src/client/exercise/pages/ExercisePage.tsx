import React from 'react'
import { useParams, useHistory } from 'react-router'
import { Page, Loading } from 'client/generic/components'
import { useLoadExercise } from '../services/exercise'
import { Exercise } from '../components/Exercise'

export function ExercisePage() {
  const { id } = useParams()
  const history = useHistory()
  const { isLoading, isSuccess, result } = useLoadExercise(id)

  const onClose = () => {
    if (history.length > 1) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <Page storePosition={false}>
      {isLoading && <Loading />}
      {isSuccess && result && <Exercise exercise={result} onClose={onClose} />}
    </Page>
  )
}
