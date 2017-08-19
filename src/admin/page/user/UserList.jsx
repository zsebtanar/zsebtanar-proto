import React from 'react'
import { getAllUser, ROLE_ADMIN, ROLE_TEACHER, ROLE_USER, updateUser } from 'shared/services/user'
import Loading from 'shared/component/general/Loading'

export default class extends React.Component {
  state = {
    userList: undefined
  }

  loadList = () => {
    getAllUser().then(userList => this.setState({userList}))
  }

  setRole = key => e => {
    updateUser(key, {role: parseInt(e.currentTarget.value, 10)})
      .then(this.loadList)
  }

  componentWillMount () {
    this.loadList()
  }

  render () {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Felhasználók</h3>
        </div>
        {this.state.userList ? this.renderTable() : <Loading/>}
      </div>
    )
  }

  renderTable () {
    return (
      <table className="table table-hover table mt-3">
        <thead>
        <tr>
          <th>#</th>
          <th>Név</th>
          <th>Szerepkör</th>
          <th className="text-center">Aktív</th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.userList.map((user, idx) =>
            <tr key={user._key}>
              <td>{idx + 1}</td>
              <td>{user.name}</td>
              <td>
                <select className="form-control" value={user.role} onChange={this.setRole(user._key)}>
                  <option value={ROLE_USER}>Diák</option>
                  <option value={ROLE_TEACHER}>Tanár</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </td>
              <td className="text-center">{
                user.active
                  ? <span className="text-success" title="Aktív"><i className="fa fa-check"/></span>
                  : <span className="text-danger" title="Inaktív"><i className="fa fa-ban"/></span>
              }
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    )
  }
}
