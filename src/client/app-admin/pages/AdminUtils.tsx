import React from 'react'
import { AlertTriangle as AlertTriangleIcon } from 'react-feather'
import { Button } from '../../generic/components/Button'
import { cloudFnGet } from '../../generic/services/firebase'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { ConfirmModal } from '../../overlay/components/ConfirmModal'
import { Icon } from 'client/generic/components/icons/Icon'

export function AdminUtils(): JSX.Element {
  const { openModal } = useOverlayDispatch()

  const confirm = (fn) =>
    openModal(<ConfirmModal>Biztos?!</ConfirmModal>).then((res) => (res ? fn() : undefined))

  const reIndexSearch = () =>
    confirm(() => cloudFnGet('/support/re-index-search', {}, { withToken: true }))

  return (
    <div className="container">
      <div className="alert alert-warning col-8 mx-auto">
        <h4>
          <Icon icon={AlertTriangleIcon} /> Vigyázz, veszélyes terület
        </h4>
        <div className="mx-5">
          Jól gondold át mielőtt használod ezeket a funkciókat.
          <br /> Mindig konzultálj a fejlesztőkkel előbb.
        </div>
      </div>

      <ul className="list-unstyled">
        <li>
          <Button onAction={reIndexSearch}>Re-index algolia search</Button>
        </li>
      </ul>
    </div>
  )
}
