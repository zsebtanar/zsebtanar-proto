import React from 'react'
import { useLoadClassifications } from '../services/classificationService'
import { Loading, Alert, Button } from '../../generic/components'
import { sortByProp } from '../../../shared/utils/fn'

export function ClassificationsAdminPage() {
  const { isLoading, isPending, isSuccess, result, hasError, error } = useLoadClassifications()

  return (
    <div>
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Feladat címkék</h3>
        <Button className="btn btn-outline-secondary">
          <i className="fa fa-plus" /> Új címke felvétel
        </Button>
      </div>
      <hr />

      {(isPending || isLoading) && <Loading />}
      {hasError && <Alert type={'danger'}>Hiba: {JSON.stringify(error)}</Alert>}
      {isSuccess && result && (
        <dl className="row">
          {Object.entries(result)
            .filter(([key]) => key !== 'id')
            .sort(sortByProp(0))
            .map(([key, value]) => (
              <>
                <dt className="col-sm-3">{key}</dt>
                <dd className="col-sm-9">{value}</dd>
              </>
            ))}
        </dl>
      )}
    </div>
  )
}
