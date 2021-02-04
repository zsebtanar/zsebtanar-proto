import React, { ReactNode, useState } from 'react'
import { ExerciseModel } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../services/exerciseContext'
import { ExerciseBody, ExerciseSolution } from './ExerciseBody'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useModel } from 'client/generic/hooks/model'
import { CloseButton } from 'client/generic/components/CloseButton'
import { ProgressBar } from 'client/generic/components/Progress'
import { Button } from 'client/generic/components/Button'

import './Exercise.scss'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { ExerciseSubTask, SubTaskSolution } from './ExerciseSubTask'
import { UserControls } from './userControls/UserControl'

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
  const [currentSubTaskIdx, setCurrentSutTaskIdx] = useState(0)
  const { bind, bindPartialModel, data } = useModel<ExerciseSolution>({})
  const { exercise, isSingle, finishedTasks } = useExercise()

  const subtasks = exercise.subTasks.slice(0, finishedTasks + 1)

  return (
    <div className="exercise-solver container">
      <div className="ex-heading">
        <div className="ex-heading-content">
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <form
        className="row ex-body"
        onSubmit={(event) => {
          event.preventDefault()
          exerciseDispatch.checkActiveSubTask(data)
          setCurrentSutTaskIdx(finishedTasks)
        }}
      >
        <div className="ex-content offset-md-1 col-md-7">
          <ExerciseMarkdown className="main-description mb-4" source={exercise.description} />

          {subtasks.map((subTask, index) => {
            const isDone = finishedTasks > index
            return (
              <div key={index}>
                <hr />
                <ExerciseMarkdown source={subTask.description} />
                {!isDone &&
                  subTask.hints.map((hint) => <ExerciseMarkdown key={hint} source={hint} />)}
              </div>
            )
          })}
        </div>
        <div className="ex-sidebar col-md-3">
          {!state.isSingle && (
            <ProgressBar value={(state.finishedTasks / state.numberOfTasks) * 100} />
          )}

          <hr />
          {subtasks[currentSubTaskIdx].controls.map((ctrl, idx) => (
            <UserControls key={idx} ctrl={ctrl} {...bind(`${idx}.${ctrl.name}`)} />
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
            <Button submit className="btn btn-secondary btn-lg">
              Ellenőrzés
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
