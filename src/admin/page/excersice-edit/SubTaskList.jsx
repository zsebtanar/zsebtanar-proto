import { __, dissoc, evolve, map, merge, values } from 'ramda'
import { uid } from 'shared/util/uuid'
import React from 'react'
import { Tab, TabNav } from 'shared/component/general/TabNav'
import Button from 'shared/component/general/Button'
import Icon from 'shared/component/general/Icon'
import { pairsInOrder } from 'shared/util/fn'
import {SubTask} from 'admin/page/excersice-edit/SubTask'

export default class SubTaskList extends React.Component {
  addSubTask = () =>
    this.setValue(
      evolve({
        subTasks: subTasks => {
          const order = values(subTasks).length
          return { ...subTasks, [uid()]: { order, title: `${order + 1}. rész`} }
        }
      })
    )

  updateSubTask = key => subTask =>
    this.setValue(
      evolve({
        subTasks: { [key]: merge(__, subTask) }
      })
    )

  removeSubTask = key => () => this.setValue(evolve({ subTasks: dissoc(key) }))

  setValue = fn => {
    const data = fn(this.props)
    this.props.onChange(data.subTasks)
  }

  render() {
    const tasks = pairsInOrder(this.props.subTasks)
    return (
      <div>
        <div className="mb-2">
          <Button
            title="Új beviteli mező felvétele"
            className="btn btn-sm btn-outline-secondary"
            onAction={this.addSubTask}
          >
            <Icon fa="plus" /> Új részfeladat
          </Button>
        </div>
        <TabNav navClassName="nav-tabs nav-fill w-100 my-4" vertical>
          {map(this.renderTabs, tasks)}
        </TabNav>
      </div>
    )
  }

  renderTabs = ([key, item]) => (
    <Tab key={key} label={item.title || `${item.order + 1}. részfeladat`}>
      <Button className="btn btn-sm btn-outline-danger mx-1" onAction={this.removeSubTask(key)}>
        <Icon fa="ban" /> Részfeladat törlése
      </Button>
      <SubTask value={item} onChange={this.updateSubTask(key)} />
    </Tab>
  )
}
