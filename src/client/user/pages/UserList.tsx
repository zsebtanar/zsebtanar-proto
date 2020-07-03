import React, { useEffect, useReducer } from 'react'
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getAllUser,
  ROLE_ADMIN,
  ROLE_TEACHER,
  ROLE_USER,
  updateUserRole,
} from 'client/user/services/user'
import { Loading } from 'client/generic/components/Loading'

export function UserList(): JSX.Element {
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    counter: 0,
    loading: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    setState({ loading: true })
    getAllUser()
      .then(({ users }) => setState({ data: users, error: null, loading: false }))
      .catch((error) => setState({ error, data: null, loaded: false }))
  }, [state.counter])

  const setRole = async (key, e) => {
    await updateUserRole(key, parseInt(e.currentTarget.value, 10))
    setState({ counter: state.counter + 1 })
  }

  const renderTable = () => {
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
          {state.data.map((user, idx) => (
            <tr key={user.uid}>
              <td>{idx + 1}</td>
              <td>{user.displayName || user.email}</td>
              <td>
                <select
                  className="form-control form-control-sm"
                  value={user?.customClaims?.role ?? ROLE_USER}
                  onChange={(e) => setRole(user.uid, e)}
                >
                  <option value={ROLE_USER}>Diák</option>
                  <option value={ROLE_TEACHER}>Tanár</option>
                  <option value={ROLE_ADMIN}>Admin</option>
                </select>
              </td>
              <td className="text-center">
                {user.disabled ? (
                  <span className="text-danger" title="Inaktív">
                    <FontAwesomeIcon icon={faBan} />
                  </span>
                ) : (
                  <span className="text-success" title="Aktív">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Felhasználók</h3>
      </div>
      {state.loading ? <Loading /> : renderTable()}
    </div>
  )
}
