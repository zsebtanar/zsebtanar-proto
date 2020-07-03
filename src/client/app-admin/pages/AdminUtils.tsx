import React from 'react'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function AdminUtils(): JSX.Element {
  return (
    <div className="container">
      <div className="alert alert-warning col-8 mx-auto">
        <h4>
          <FontAwesomeIcon icon={faExclamationTriangle} size="2x" /> Vigyázz, veszélyes terület
        </h4>
        <div className="mx-5">
          Jól gondold át mielőtt használod ezeket a funkciókat.
          <br /> Mindig konzultálj a fejlesztőkkel előbb.
        </div>
      </div>

      <h3 className="text-center">Hamarosan</h3>
    </div>
  )
}
