import React from 'react'
import {
  createClassification,
  updateClassification,
  getAllClassificationByGroup,
  GRADE,
  SUBJECT,
  TAGS,
  TOPIC
} from 'shared/services/classification'
import Button from 'shared/component/general/Button'

export default class extends React.Component {
  state = {
    group: undefined,
    list: undefined
  }

  addItem = () => {
    const name = window.prompt('Név')
    const group = this.state.group
    createClassification(group, {name})
      .then(() => this.loadGroup(group))
  }
  editItem = (item) => () => {
    const name = window.prompt('Név', item.name)
    const group = this.state.group
    updateClassification(group, item._key, {name})
      .then(() => this.loadGroup(group))
  }

  setGroup = (e) => {
    const {value} = e.currentTarget || e
    this.setState({group: value, list: undefined})
    this.loadGroup(value)
  }

  loadGroup = (group) => {
    getAllClassificationByGroup(group)
      .then((list) => this.setState({list}))
  }

  componentWillMount () {
    this.setGroup({value: GRADE})
  }

  render () {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Kategóriák</h3>
          <select onChange={this.setGroup} value={this.state.group} className="form-control col-3">
            <option value={GRADE}>Osztály</option>
            <option value={SUBJECT}>Tantárgy</option>
            <option value={TOPIC}>Témakör</option>
            <option value={TAGS}>Címkék</option>
          </select>
        </div>
        {this.state.list ? this.renderTable() : 'Kis türelmet...'}
      </div>
    )
  }

  renderTable () {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-end">
          <Button onAction={this.addItem}><i className="fa fa-plus"/> Új elem felvétele</Button>
        </div>
        <table className="table table-hover table mt-3">
          <thead>
          <tr>
            <th>#</th>
            <th>Név</th>
            <th className="text-center action-column"><i className="fa fa-lg fa-cog"/></th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.list.map((item, idx) =>
              <tr key={item._key}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td className="text-center">
                  <Button className="btn-sm btn-secondary" onAction={this.editItem(item)}>
                    <i className="fa fa-edit"/>
                  </Button>
                </td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>

    )
  }
}
