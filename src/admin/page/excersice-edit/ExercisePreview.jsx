import { pairsInOrder } from 'util/fn'
import * as React from 'react'
import UserControls from 'shared/component/userControls/UserControl'
import Markdown from 'shared/component/general/Markdown'

export default function ExercisePreview (props) {
  const {description, controls} = props.exercise
  return (<div>
    {
      description
        ? <Markdown source={description}/>
        : <Muted>feladatleírás...</Muted>
    }
    {
      (pairsInOrder(controls) || []).map(([key, {controlType, controlProps}]) =>
        <div className="form-group" key={key}>
          <UserControls {...{controlType, controlProps}}/>
        </div>
      )
    }
    <hr/>
    {
      __DEV__
        ? <pre>{
          JSON.stringify(props.exercise, null, 3)
        }</pre>
        : ''
    }
  </div>)
}
