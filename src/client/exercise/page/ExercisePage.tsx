import React from 'react'
import { useParams, useHistory } from 'react-router'
import { Page } from '../../generic/component/Page'
import { Exercise } from '../component/Exercise'

export function ExercisePage() {
  const { id } = useParams()
  const history = useHistory()

  const onClose = () => {
    if (history.length > 1) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <Page storePosition={false}>
      <Exercise exercise={{}} onClose={onClose} />
    </Page>
  )
}
