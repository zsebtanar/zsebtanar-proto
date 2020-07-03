import React, { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { ExerciseModel } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../services/exerciseContext'
import { ExerciseBody, ExerciseSolution } from './ExerciseBody'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useModel } from 'client/generic/hooks/model'
import { CloseButton } from 'client/generic/components/CloseButton'
import { ProgressBar } from 'client/generic/components/Progress'
import { Button } from 'client/generic/components/Button'

import './Exercise.scss'

interface Props {
  seed: number
  exercise: ExerciseModel
  onClose?: () => void
}

export function Exercise({ exercise, onClose, seed }: Props) {
  return (
    <ExerciseProvider exercise={exercise}>
      <PocketLispProvider seed={seed} script={exercise.script}>
        <ExerciseComponent onClose={onClose} />
      </PocketLispProvider>
    </ExerciseProvider>
  )
}

interface ExerciseComponentProps {
  onClose?: () => void
}
function ExerciseComponent({ onClose }: ExerciseComponentProps) {
  const state = useExercise()
  const exerciseDispatch = useExerciseDispatch()
  const { bindPartialModel, data } = useModel<ExerciseSolution>({})

  return (
    <div className="exercise">
      <ExerciseHeader>
        <CloseButton onClick={onClose} />
        {!state.isSingle && (
          <ProgressBar
            className="w-100 mx-4"
            value={(state.finishedTasks / state.numberOfTasks) * 100}
          />
        )}
      </ExerciseHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          exerciseDispatch.checkActiveSubTask(data)
        }}
      >
        <ExerciseBody {...bindPartialModel()} />
        <Button submit className="btn btn-secondary btn-lg">
          <FontAwesomeIcon icon={faCheck} /> Ellenőrzés
        </Button>
      </form>
    </div>
  )
}
interface ExerciseHeaderProps {
  children: ReactNode
}

function ExerciseHeader({ children }: ExerciseHeaderProps) {
  return (
    <div className="exercise-header">
      <div className="container d-flex align-items-center flex-row">{children}</div>
    </div>
  )
}
