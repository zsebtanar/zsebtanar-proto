import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { CheckCircle as CheckIcon, Frown as FrownIcon } from 'react-feather'
import { PublicExercise, UCUserAnswer } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../../providers/exerciseContext'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useModel } from 'client/generic/hooks/model'
import { CloseButton } from 'client/generic/components/CloseButton'
import { Button } from 'client/generic/components/Button'
import { ExerciseMarkdown } from '../ExerciseMarkdown'
import { UserControls } from '../userControls/UserControl'
import { range } from 'shared/utils/fn'
import { Icon } from '../../../generic/components/icons/Icon'
import { useOverlayDispatch } from '../../../overlay/providers/OverlayProvider'
import { ExerciseDoneModal } from './ExerciseDoneModal'
import { randomInt } from 'shared/utils/math'
import { SEED_RANGE } from 'shared/math/constatns'

import './Exercise.scss'

interface Props {
  seed: number
  exercise: PublicExercise
  onClose?: () => void
}

export function Exercise({ exercise, onClose, seed }: Props): JSX.Element {
  const [seedValue, setSeedValue] = useState(seed)
  const reloadExercise = () => {
    setSeedValue(randomInt(SEED_RANGE) + 1)
  }
  return (
    <ExerciseProvider key={seedValue} exercise={exercise}>
      <PocketLispProvider seed={seedValue} script={exercise.script}>
        <ExerciseComponent onClose={onClose} seed={seedValue} reloadExercise={reloadExercise} />
      </PocketLispProvider>
    </ExerciseProvider>
  )
}

interface ExerciseComponentProps {
  onClose?: () => void
  seed: number
  reloadExercise: () => void
}

function ExerciseComponent({ onClose, seed, reloadExercise }: ExerciseComponentProps) {
  const state = useExercise()
  const exerciseDispatch = useExerciseDispatch()
  const { bind: bindAnswer, data: answers, reset: resetAnswer } = useModel<UCUserAnswer[]>({
    value: [],
  })
  const continueBtnRef = useRef<HTMLButtonElement>(null)
  const { openModal } = useOverlayDispatch()

  useEffect(() => {
    if (continueBtnRef) {
      continueBtnRef?.current?.focus()
    }
  }, [state.selectedSubtask.status])

  const onSubmit = async (event) => {
    if (state.isCurrentSubtaskActive) {
      event.preventDefault()
      const result = await exerciseDispatch.checkActiveSubTask(answers, seed)
      if (result) {
        resetAnswer()
      }
    }
  }

  useEffect(() => {
    if (state.status === 'solved') {
      openModal(<ExerciseDoneModal reloadExercise={reloadExercise} />)
    }
  }, [state.status])

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
                  idx < state.numberOfFinishedTasks ? 'btn-success' : 'btn-secondary'
                return (
                  <button
                    key={idx}
                    type="button"
                    className={cx('btn', className, {
                      active: state.selectedSubtask.index === idx && state.status !== 'solved',
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

          <div className="text-center">
            {state.isCurrentSubtaskActive && (
              <>
                {state.status === 'checkFailed' && (
                  <p className="text-warning">
                    <Icon icon={FrownIcon} /> Próbáld újra.
                  </p>
                )}
                <Button
                  submit
                  btn={'primary'}
                  loading={state.status === 'checking'}
                  className="w-100 mb-1"
                >
                  Ellenőrzés
                </Button>
                {state.selectedSubtask.isHintsLeft && state.selectedSubtask.numberOfAttempt > 0 && (
                  <Button btn={'outline-secondary'} className="w-100" onAction={getHint}>
                    Kérek segítséget
                  </Button>
                )}
              </>
            )}
            {!state.isCurrentSubtaskActive && (
              <>
                <p>
                  <Icon icon={CheckIcon} /> Helyes megoldás!
                </p>
                {state.status !== 'solved' && (
                  <Button
                    submit
                    btn={'outline-primary'}
                    loading={state.status === 'checking'}
                    className="w-100"
                    ref={continueBtnRef}
                    onAction={() => selectSubtask(state.selectedSubtask.index + 1)}
                  >
                    Következő
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
