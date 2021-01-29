import React from 'react'
import cx from 'classnames'
import { useExercise, useExerciseDispatch } from '../services/exerciseContext'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { ExerciseSubTask } from 'shared/exercise/types'
import { UserControls } from './userControls/UserControl'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { Button } from 'client/generic/components/Button'

export type SubTaskSolution = Record<string, unknown>

interface SubTaskProps extends UseModelProps<SubTaskSolution> {
  index: number
  task: ExerciseSubTask
}

export function ExerciseSubTask({ index, task, ...bindProps }: SubTaskProps) {
  const { bind } = useModel<SubTaskSolution>(bindProps)
  const { activeSubTask, finishedTasks } = useExercise()
  const { getNextHint } = useExerciseDispatch()

  const isDone = finishedTasks > index

  // FIXME: scroll task and hint into view
  return (
    <div className={cx('exercise-sub-task', { finished: isDone })}>
      <ExerciseMarkdown source={task.description} />
      {!isDone && (
        <div className="form-group hints">
          {task.hints.map((hint) => (
            <div className="mb-2" key={hint}>
              <ExerciseMarkdown source={hint} />
            </div>
          ))}
        </div>
      )}

      {task.controls.map((ctrl, idx) => (
        <UserControls key={idx} ctrl={ctrl} {...bind(ctrl.name)} disabled={isDone} />
      ))}

      {!isDone && (
        <div className="exercise-footer">
          <div className="container ">
            {activeSubTask.numberOfAttempt > 0 && activeSubTask.isHintsLeft && (
              <Button className="btn-link" onAction={getNextHint}>
                Kérek segítséget ({activeSubTask.hintsLeft} maradt)
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
