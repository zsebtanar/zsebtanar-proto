import { GridComponent } from 'client-common/component/grid/GridComponent'
import { FeedbackDataModel, FeedbackService } from 'client-common/services/feedbackService'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import * as React from 'react'

export class ExerciseGrid extends React.PureComponent<{}> {
  private ds = new FireStoreGridDS(FeedbackService)

  render(): React.ReactNode {
    const Grid = GridComponent as new () => GridComponent<FeedbackDataModel>
    return
  }
}
