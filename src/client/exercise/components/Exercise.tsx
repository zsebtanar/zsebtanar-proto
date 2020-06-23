import React, { ReactNode } from 'react'
import { ExerciseModel } from 'shared/exercise/types'
import { ExerciseProvider, useExercise, useExerciseDispatch } from '../services/exerciseContext'
import { CloseButton, ProgressBar, Button } from 'client/generic/components'
import { ExerciseBody, ExerciseSolution } from './ExerciseBody'
import { PocketLispProvider } from '../../script/providers/PocketLispProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useModel } from '../../generic/hooks/model'

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
        onSubmit={event => {
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
