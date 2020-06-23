import React from 'react'
import { toAbcIndex } from 'shared/utils/fn'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { useExercise } from '../services/exerciseContext'
import { ExerciseSubTask, SubTaskSolution } from './ExerciseSubTask'
import { UseModelProps, useModel } from '../../generic/hooks/model'

export type ExerciseSolution = SubTaskSolution[]

type Props = UseModelProps<ExerciseSolution>

export function ExerciseBody({ ...bindProps }: Props) {
  const { bind } = useModel<ExerciseSolution>(bindProps)
  const { exercise, isSingle } = useExercise()

  return (
    <div className="exercise-body container">
      <div className="row">
        <div className="col-lg-8 col-md-10 mx-auto my-3">
          <ExerciseMarkdown className="main-description mb-3" source={exercise.description} />
          {exercise.subTasks.map((subTask, index) => (
            <div className="row" key={`subtask-${index}`}>
              <div className="sub-task-index col-md-1 mb-1 font-weight-bold">
                {isSingle ? '' : `${toAbcIndex(index)})`}
              </div>
              <div className="col-md-10">
                <ExerciseSubTask task={subTask} index={index} {...bind(`${index}`)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
