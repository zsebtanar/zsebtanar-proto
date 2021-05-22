import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ExerciseModel } from 'shared/exercise/types'
import { Plus as PlusIcon, Edit as EditIcon, Copy as CopyIcon, Eye as EyeIcon } from 'react-feather'
import { Grid } from 'client/generic/components/grid/Grid'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import { ExerciseStateBadge } from '../components/admin/ExerciseStateBadge'
import { ExternalLink } from '../../generic/components/ExternalLink'
import { Icon } from 'client/generic/components/icons/Icon'

export function ExerciseGrid(): JSX.Element {
  const dataSource = useMemo(
    () =>
      new FireStoreGridDS<ExerciseModel>('exercise', 'private', { orderBy: [['created', 'desc']] }),
    [],
  )

  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Feladatok</h3>
        <NavLink exact to="/exercise/add" className="btn btn-outline-secondary">
          <Icon icon={PlusIcon} /> Új Feladat
        </NavLink>
      </div>
      <Grid
        dataSource={dataSource}
        columnDefs={[
          { title: '#', width: 50, renderer: (data, row, idx) => idx + 1 },
          {
            title: '@',
            width: 50,
            renderer: (_, row) => <ExerciseStateBadge short value={row.state} />,
          },
          { key: 'title', title: 'Név' },
          { title: 'Opciók', width: 150, renderer: (_, row) => renderListItem(row) },
        ]}
      />
    </div>
  )
}

const renderListItem = (item: ExerciseModel) => {
  return (
    <div className="text-center">
      <ExternalLink
        hideIcon
        href={`/exercise/${item.id}?clone`}
        className="btn btn-sm btn-light"
        title="Megtekintés"
      >
        <Icon icon={EyeIcon} />
      </ExternalLink>
      &nbsp;
      <NavLink
        exact
        to={`/exercise/edit/${item.id}?clone`}
        className="btn btn-sm btn-light"
        title="Másolás"
      >
        <Icon icon={CopyIcon} />
      </NavLink>
      &nbsp;
      <NavLink
        exact
        to={`/exercise/edit/${item.id}`}
        className="btn btn-sm btn-light"
        title="Szerkesztés"
      >
        <Icon icon={EditIcon} />
      </NavLink>
    </div>
  )
}
