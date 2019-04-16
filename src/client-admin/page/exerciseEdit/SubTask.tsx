import * as React from 'react'
import { assocPath, pathOr, pipe } from 'ramda'
import { connect } from 'react-redux'

import { TabNav } from 'client-common/component/general/tab/TabNav'
import { TextEditor } from 'client-common/component/general/TextEditor'
import { Tab } from '../../../client-common/component/general/tab/Tab'
import { HintList } from './HintList'
import { UserControlList } from './UserControlList'
import { openExerciseImageDialog } from 'client-common/store/actions/modal'

const TABS = ['Leírás', 'Megoldások', 'Útmutatók']

function mapStateToProps(state) {
  return {
    resources: state.resources.data
  }
}

const mapDispatchToProps = {
  openExerciseImageDialog
}

export const SubTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component<any, any> {
    render() {
      return (
        <TabNav navClassName="nav-tabs nav-fill w-100 my-4">
          {TABS.map((item, idx) => (
            <Tab key={item} label={item}>
              {this.renderActiveTabContent(idx)}
            </Tab>
          ))}
        </TabNav>
      )
    }

    renderActiveTabContent(idx) {
      switch (idx) {
        case 0:
          return this.renderDescription()
        case 1:
          return this.renderUserControls()
        case 2:
          return this.renderHints()
      }
    }
    updateDescription = description => this.setValue(assocPath(['description'], description.value))

    updateUserControl = data =>
      this.setValue(
        pipe(
          assocPath(['controls'], data.controls),
          assocPath(['solutions'], data.solutions)
        )
      )

    updateHints = hints => this.setValue(assocPath(['hints'], hints))

    setValue = fn => {
      const data = fn(this.props.value)
      this.props.onChange(data)
    }

    renderDescription() {
      const { value: subTask, resources } = this.props;
      return (
        <TextEditor
          className="form-group"
          name="description"
          rows={10}
          required
          onChange={this.updateDescription}
          value={pathOr('', ['description'], subTask)}
          resources={resources}
        />
      )
    }

    renderUserControls() {
      const subTask = this.props.value
      return (
        <UserControlList
          controls={subTask.controls}
          solutions={subTask.solutions}
          onChange={this.updateUserControl}
        />
      )
    }

    renderHints() {
      const subTask = this.props.value
      return <HintList hints={subTask.hints} onChange={this.updateHints} />
    }
  }
)
