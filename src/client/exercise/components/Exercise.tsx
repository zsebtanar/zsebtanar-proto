import React from 'react'
import cx from 'classnames'
import { PublicExercise, UCUserAnswer } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../providers/exerciseContext'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useModel } from 'client/generic/hooks/model'
import { CloseButton } from 'client/generic/components/CloseButton'
import { Button } from 'client/generic/components/Button'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { UserControls } from './userControls/UserControl'
import { range } from '../../../shared/utils/fn'

import './Exercise.scss'

interface Props {
  seed: number
  exercise: PublicExercise
  onClose?: () => void
}

export function Exercise({ exercise, onClose, seed }: Props): JSX.Element {
  return (
    <ExerciseProvider exercise={exercise}>
      <PocketLispProvider seed={seed} script={exercise.script}>
        <ExerciseComponent onClose={onClose} seed={seed} />
      </PocketLispProvider>
    </ExerciseProvider>
  )
}

interface ExerciseComponentProps {
  onClose?: () => void
  seed: number
}

function ExerciseComponent({ onClose, seed }: ExerciseComponentProps) {
  const state = useExercise()
  const exerciseDispatch = useExerciseDispatch()
  const { bind: bindAnswer, data: answers, reset: resetAnswer } = useModel<UCUserAnswer[]>({
    value: [],
  })

  const onSubmit = async (event) => {
    if (state.isCurrentSubtaskActive) {
      event.preventDefault()
      await exerciseDispatch.checkActiveSubTask(answers, seed)
      resetAnswer()
    }
  }

  const selectSubtask = (idx) => {
    exerciseDispatch.selectSubtask(idx)
  }

  const getHint = () => {
    exerciseDispatch.getNextHint()
  }

  return (
    <div className="exercise-solver container">
      <div className="ex-heading">
        <div className="ex-heading-content">
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <form className="row ex-body" onSubmit={onSubmit}>
        <div className="ex-content offset-xl-1 col-xl-7 offset-lg-1 col-lg-6">
          <ExerciseMarkdown className="main-description mb-4" source={state.exercise.description} />

          <div className="sub-task">
            <hr />
            <ExerciseMarkdown source={state.selectedSubtask.description} />
            {state.selectedSubtask.hints.map((hint) => (
              <ExerciseMarkdown key={hint} source={hint} />
            ))}
          </div>
        </div>
        <div className="ex-sidebar col-xl-3 col-lg-4">
          {!state.isSingle && (
            <div className="btn-group subtask-progressbar" role="group">
              {range(0, state.numberOfTasks).map((idx) => {
                const className =
                  idx === state.numberOfFinishedTasks
                    ? 'btn-primary'
                    : idx < state.numberOfFinishedTasks
                    ? 'btn-success'
                    : 'btn-secondary'
                return (
                  <button
                    key={idx}
                    type="button"
                    className={cx('btn', className, {
                      active: state.selectedSubtask.index === idx,
                    })}
                    title={`${idx + 1}. részfeladat`}
                    disabled={idx > state.numberOfFinishedTasks}
                    onClick={() => selectSubtask(idx)}
                  />
                )
              })}
            </div>
          )}

          <hr />

          {state.selectedSubtask.controls.map((ctrl, idx) => {
            const isDone = state.selectedSubtask.status === 'done'
            const params = isDone
              ? ({ value: state.selectedSubtask.answers?.[idx] } as any)
              : bindAnswer(`${idx}`)
            return <UserControls disabled={isDone} key={idx} ctrl={ctrl} {...params} />
          })}

          {state.isCurrentSubtaskActive && (
            <div className="text-center">
              <Button submit btn={'secondary'} large loading={state.status === 'checking'}>
                Ellenőrzés
              </Button>
              {state.status === 'checkFailed' && (
                <p className="text-warning">Ellenőrizd a válaszod és próbáld újra.</p>
              )}
              {state.selectedSubtask.isHintsLeft && state.selectedSubtask.numberOfAttempt > 0 && (
                <div>
                  <Button btn={'link'} onAction={getHint}>
                    Kérek segítésget
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
