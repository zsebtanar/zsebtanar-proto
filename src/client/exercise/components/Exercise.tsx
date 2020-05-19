import React, { useEffect, ReactNode } from 'react'
import { toAbcIndex } from 'shared/util/fn'
import { SubTask } from 'client-common/page/exercise/SubTask'
import { ProgressBar } from 'client-common/component/general/Progress'
import { ExerciseData } from '../type'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../service/exerciseContext'
import { CloseButton } from '../../../client-common/component/general/CloseButton'
import { ExerciseMarkdown } from './ExerciseMarkdown'

import './Exercise.scss'
import { Button } from '../../../client-common/component/general/Button'
import { Icon } from '../../../client-common/component/general/Icon'
import * as cx from 'classnames'
import { Markdown } from '../../../client-common/component/general/Markdown'

interface Props {
  exercise: ExerciseData
  onClose?: () => void
}

export function Exercise({ exercise, onClose }: Props) {
  return (
    <ExerciseProvider>
      {function ExerciseComponent() {
        const state = useExercise()
        const exerciseDispatch = useExerciseDispatch()

        useEffect(() => {
          exerciseDispatch.init(exercise)
        })

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

            <ExerciseBody>
              <form onSubmit={() => dis}>
              <ExerciseMarkdown className="main-description mb-3" source={exercise.description} />

              {state.subTasks.map(([taskId, task], index) => (
                <div className="row" key={taskId}>
                  <div className="sub-task-index col-md-1 mb-1 font-weight-bold">
                    {state.isSingle ? '' : `${toAbcIndex(task.order)})`}
                  </div>
                  <div className="col-md-10">
                    <SubTask id={taskId} task={task} index={index} />
                  </div>
                </div>
              ))}
              </form>
            </ExerciseBody>

            {this.renderResult()}
          </div>
        )
      }}
    </ExerciseProvider>
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

interface ExerciseBodyProps {
  children: ReactNode
}

function ExerciseBody({ children }: ExerciseBodyProps) {
  return (
    <div className="exercise-body container">
      <div className="row">
        <div className="col-lg-8 col-md-10 mx-auto my-3">{children}</div>
      </div>
    </div>
  )
}

interface SubTaskProps {
  id: string
  index: number
}

function SubTask({ index }: SubTaskProps) {
  const state = useExercise()

  const isDone = state.finishedTasks > index
  return (
    <div className={cx('exercise-sub-task', { finished: isDone })} ref={this.scrollToSubTask}>
      {this.renderDescription()}
      {!isDone && (
        <div className="form-group hints">
          {hints.map(() => (
            <div className="mb-2" key={item.key} ref={this.scrollToHint}>
              <Markdown source={item.hint.text} />
            </div>
          ))}
        </div>
      )}


        {controls.map(this.renderControl)}

        {!isDone && (
          <div className="exercise-footer">
            <div className="container ">
              {this.state.checkCounter > 0 &&
                task.hintsLeft > 0 && (
                  <Button
                    className="btn-link"
                    onAction={this.getHint}
                    loading={loadingHint}
                    disabled={loadingCheck}
                  >
                    Kérek segítséget ({task.hintsLeft} maradt)
                  </Button>
                )}

              <Button
                submit
                loading={loadingCheck}
                disabled={loadingHint}
                className="btn btn-secondary btn-lg"
              >
                <Icon fa="check" /> Ellenőrzés
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

//
// const mapDispatchToProps = {
//   getPublicExerciseAction,
//   unloadExerciseAction,
//   openWikiModal
// }
//
// const isFinished = pathOr(false, ['exercise', 'isFinished'])
//
//
//   class ExerciseComp extends React.Component<any, any> {
//     componentDidMount() {
//       const { match, getPublicExerciseAction, previewMode } = this.props
//
//       if (!previewMode) {
//         getPublicExerciseAction(match.params.key)
//       }
//     }
//
//     componentWillUnmount() {
//       const { unloadExerciseAction, previewMode } = this.props
//
//       if (!previewMode) {
//         unloadExerciseAction()
//       }
//     }
//
//     render() {
//       const { loading, exerciseError } = this.props
//
//       if (loading) {
//         return <Loading />
//       } else if (exerciseError) {
//         return this.renderError()
//       } else {
//         return this.renderExercise()
//       }
//     }
//
//     private renderExercise() {
//       const ex = this.props.exercise
//       const subTaskList = pairsInOrder(ex.subTasks)
//       const isSingleTask = subTaskList.length === 1
//       const subTasks = subTaskList.filter(([_, task]: any) => task.status !== TASK_STATUS_WAITING)
//
//       return (
//         <div className="exercise-page">
//           <div className="exercise-header">
//             <div className="container d-flex align-items-center flex-row">
//               <Button className="close" onAction={this.historyBack}>
//                 <span aria-hidden="true">&times;</span>
//               </Button>
//               {!isSingleTask && (
//                 <ProgressBar
//                   className="w-100 mx-4"
//                   value={(ex.finishedTasks / ex.allTasks) * 100}
//                 />
//               )}
//             </div>
//           </div>
//
//           <div className="container exercise-body">
//             <div className="row">
//               <div className="col-lg-8 col-md-10 mx-auto my-3">
//                 <Markdown
//                   className="main-description mb-3"
//                   source={ex.description}
//                   resources={ex.resources}
//                   onWikiLink={this.openWikiModal}
//                 />
//
//                 {subTasks.map(([taskId, task], idx) =>
//                   this.renderSubTask(idx, ex._key, taskId, task, isSingleTask, ex.resources)
//                 )}
//               </div>
//             </div>
//           </div>
//           {this.renderResult()}
//         </div>
//       )
//     }
//
//     private renderSubTask(idx, exId, taskId, task, isSingleTask, resources) {
//       return (
//         <div className="row" key={taskId}>
//           <div className="sub-task-index col-md-1 mb-1 font-weight-bold">
//             {isSingleTask ? '' : `${abcIndex(task.order)})`}
//           </div>
//           <div className="col-md-10">
//             <SubTask
//               exerciseId={exId}
//               id={taskId}
//               task={task}
//               resources={resources}
//               isFirst={idx === 0}
//             />
//           </div>
//         </div>
//       )
//     }
//
//     private renderError() {
//       const error = this.props.exerciseError
//
//       return <ShowError error={error} showMenu />
//     }
//
//     private renderResult() {
//       if (isFinished(this.props)) {
//         return (
//           <div className="exercise-result">
//             <div className="container">
//               <p className="my-3 text-success">
//                 <i className="fa fa-check fa-lg" /> Gratulálunk! Sikeresen megoldottad a feladatot.
//               </p>
//               <Button className="btn btn-secondary btn-lg btn-block" onAction={this.historyBack}>
//                 <i className="fa fa-chevron-left" /> Vissza a feladat listához
//               </Button>
//             </div>
//           </div>
//         )
//       }
//     }
//
//     private openWikiModal = pageId => {
//       this.props.openWikiModal({ pageId })
//     }
//   }
// )
