import React from 'react'
import { pathOr } from 'ramda'
import {
  getAllUser,
  ROLE_ADMIN,
  ROLE_TEACHER,
  ROLE_USER,
  updateUserRole
} from 'shared/services/user'
import { Loading } from 'shared/component/general/Loading'

export class UserList extends React.Component {
  state = {
    userList: undefined
  }

  loadList = () => {
    getAllUser().then(({ data }) => this.setState({ userList: data.users }))
  }

  setRole = key => e => {
    this.setState({ userList: undefined })
    updateUserRole(key, parseInt(e.currentTarget.value, 10)).then(this.loadList)
  }

  componentWillMount() {
    this.loadList()
  }

  render() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Felhasználók</h3>
        </div>
        {this.state.userList ? this.renderTable() : <Loading />}
      </div>
    )
  }

  renderTable() {
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
          {this.state.userList.map((user, idx) => (
            <tr key={user.uid}>
              <td>{idx + 1}</td>
              <td>{user.displayName || user.email}</td>
              <td>
                <select
                  className="form-control form-control-sm"
                  value={pathOr(ROLE_USER, ['customClaims', 'role'], user)}
                  onChange={this.setRole(user.uid)}
                >
                  <option value={ROLE_USER}>Diák</option>
                  <option value={ROLE_TEACHER}>Tanár</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </td>
              <td className="text-center">
                {user.disabled ? (
                  <span className="text-danger" title="Inaktív">
                    <i className="fa fa-ban" />
                  </span>
                ) : (
                  <span className="text-success" title="Aktív">
                    <i className="fa fa-check" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
