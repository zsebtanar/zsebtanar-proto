import React from 'react'
import { ExerciseMarkdown } from './ExerciseMarkdown'
import { useExercise } from '../services/exerciseContext'
import { ExerciseSubTask, SubTaskSolution } from './ExerciseSubTask'
import { useModel, UseModelProps } from '../../generic/hooks/model'

export type ExerciseSolution = SubTaskSolution[]

type Props = UseModelProps<ExerciseSolution>

export function ExerciseBody({ ...bindProps }: Props): JSX.Element {
  const { bind } = useModel<ExerciseSolution>(bindProps)
  const { exercise, finishedTasks } = useExercise()

  return (
    <div className="exercise-body container">
      <div className="row">
        <div className="col-lg-8 col-md-10 mx-auto my-3">
          <ExerciseMarkdown className="main-description mb-3" source={exercise.description} />
          {exercise.subTasks.slice(0, finishedTasks + 1).map((subTask, index) => (
            <ExerciseSubTask key={index} task={subTask} index={index} {...bind(`${index}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}
