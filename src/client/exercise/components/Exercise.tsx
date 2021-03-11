import React from 'react'
import { ExerciseModel, UCUserAnswer } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../providers/exerciseContext'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useModel } from 'client/generic/hooks/model'
import { CloseButton } from 'client/generic/components/CloseButton'
import { ProgressBar } from 'client/generic/components/Progress'
import { Button } from 'client/generic/components/Button'

import './Exercise.scss'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { UserControls } from './userControls/UserControl'

interface Props {
  seed: number
  exercise: ExerciseModel
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
  const { bind: bindAnswer, data: answers } = useModel<UCUserAnswer[]>({ value: [] })

  const onSubmit = (event) => {
    event.preventDefault()
    exerciseDispatch.checkActiveSubTask(answers, seed)
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

          {state.finishedTasks.map((subTask, index) => (
            <div key={index}>
              <hr />
              <ExerciseMarkdown source={subTask.description} />
              {subTask.hints.map((hint) => (
                <ExerciseMarkdown key={hint} source={hint} />
              ))}
            </div>
          ))}
        </div>
        <div className="ex-sidebar col-xl-3 col-lg-4">
          {!state.isSingle && (
            <ProgressBar value={(state.numberOfFinishedTasks / state.numberOfTasks) * 100} />
          )}

          <hr />

          {state.activeSubTask.controls.map((ctrl, idx) => (
            <UserControls key={idx} ctrl={ctrl} {...bindAnswer(`${idx}`)} />
          ))}

          {/*<div className={cx('exercise-sub-task', { finished: isDone })}>*/}

          {/*  {!isDone && (*/}
          {/*    <div className="exercise-footer">*/}
          {/*      <div className="container ">*/}
          {/*        {activeSubTask.numberOfAttempt > 0 && activeSubTask.isHintsLeft && (*/}
          {/*          <Button className="btn-link" onAction={getNextHint}>*/}
          {/*            Kérek segítséget ({activeSubTask.hintsLeft} maradt)*/}
          {/*          </Button>*/}
          {/*        )}*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*</div>*/}

          <div className="text-center">
            <Button
              submit
              className="btn btn-secondary btn-lg"
              loading={state.status === 'checking'}
            >
              Ellenőrzés
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
