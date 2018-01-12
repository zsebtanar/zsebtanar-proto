import { assocPath, pathOr, pipe } from 'ramda'
import React from 'react'
import { Tab, TabNav } from 'shared/component/general/TabNav'
import TextEditor from 'shared/component/general/TextEditor'
import HintList from 'admin/page/excersice-edit/HintList'
import UserControlList from 'admin/page/excersice-edit/UserControlList'

const TABS = ['Leírás', 'Megoldások', 'Útmutatók']

export default class SubTask extends React.Component {
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
  updateDescription = description =>
    this.setValue(assocPath(['description'], description.value))

  updateUserControl = data =>
    this.setValue(pipe(
      assocPath(['controls'], data.controls),
      assocPath(['solutions'], data.solutions)
    ))

  updateHints = hints => this.setValue(assocPath(['hints'], hints))

  setValue = fn => {
    const data = fn(this.props.value)
    this.props.onChange(data)
  }

  renderDescription() {
    const subTask = this.props.value
    return (
      <TextEditor
        className="form-group"
        name="description"
        rows="10"
        required
        onChange={this.updateDescription}
        value={pathOr('', ['description'], subTask)}
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
    return (
      <div className="col-11 mx-auto">
        <HintList hints={subTask.hints} onChange={this.updateHints} />
      </div>
    )
  }
}
