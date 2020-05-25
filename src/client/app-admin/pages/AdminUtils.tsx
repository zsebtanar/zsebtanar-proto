import React from 'react'
import { Icon, Button } from 'client/generic/components'
import { rePublishAllExercise } from 'client/app-admin/services/admin'

export function AdminUtils() {
  const rePublishAll = () => {
    if (window.confirm('Gondold meg kétszer mielőtt elindítod')) {
      rePublishAllExercise().then(() => alert('Kész! Frissítsd az oldalt.'))
    }
  }

  return (
    <div className="container">
      <div className="alert alert-warning col-8 mx-auto">
        <h4>
          <Icon fa="exclamation-triangle" size="2x" /> Vigyázz, veszélyes terület
        </h4>
        <div className="mx-5">
          Jól gondold át mielőtt használod ezeket a funkciókat.
          <br /> Mindig konzultálj a fejlesztőkkel előbb.
        </div>
      </div>

      <h4>DB migráció</h4>

      <table className="table my-4">
        <tbody>
          <tr>
            <td>Publikus feladatok újra mentése</td>
            <td>
              <Button onAction={rePublishAll}>Indít</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
