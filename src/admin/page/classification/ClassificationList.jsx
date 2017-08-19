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
import Loading from 'shared/component/general/Loading'

export default class extends React.Component {
  state = {
    group: undefined,
    subjects: [],
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
    Promise.all([
      getAllClassificationByGroup(SUBJECT),
      getAllClassificationByGroup(group)
    ])
      .then(([subjects, list]) => this.setState({subjects, list}))
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
            <optgroup label="Témakörök">
              {this.state.subjects.map(sub => <option key={sub._key} value={`${SUBJECT}.${sub._key}.${TOPIC}`}>{sub.name}</option>)}
            </optgroup>
            <option value={TAGS}>Címkék</option>
          </select>
        </div>
        {this.state.list ? this.renderTable() : <Loading/>}
      </div>
    )
  }

  renderTable () {
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-end">
          <Button className="btn btn-outline-secondary" onAction={this.addItem}><i className="fa fa-plus"/> Új elem felvétele</Button>
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
                <td>
                  {this.state.group === SUBJECT
                    ? <span onClick={() => this.setGroup({value: `${SUBJECT}.${item._key}.${TOPIC}`})}>
                      {item.name} <span className="badge badge-default">{Object.keys(item[TOPIC] || {}).length} témakör</span>
                    </span>
                    : item.name
                  }
                </td>
                <td className="text-center">
                  <Button className="btn-sm btn-light" onAction={this.editItem(item)}>
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
