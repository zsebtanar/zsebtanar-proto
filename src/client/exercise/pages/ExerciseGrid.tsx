import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ExerciseModel } from 'shared/exercise/types'
import { exerciseDataService } from '../services/exercise'
import { faEdit, faClone, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid } from 'client/generic/components/grid/Grid'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import { ExerciseStateBadge } from '../components/form/ExerciseStateBadge'
import { ExternalLink } from '../../generic/components/ExternalLink'

export function ExerciseGrid(): JSX.Element {
  const dataSource = useMemo(
    () => new FireStoreGridDS(exerciseDataService, { orderBy: [['created', 'desc']] }),
    [],
  )

  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Feladatok</h3>
        <NavLink exact to="/exercise/add" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faPlus} /> Új Feladat
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
        <FontAwesomeIcon icon={faEye} />
      </ExternalLink>
      &nbsp;
      <NavLink
        exact
        to={`/exercise/edit/${item.id}?clone`}
        className="btn btn-sm btn-light"
        title="Másolás"
      >
        <FontAwesomeIcon icon={faClone} />
      </NavLink>
      &nbsp;
      <NavLink
        exact
        to={`/exercise/edit/${item.id}`}
        className="btn btn-sm btn-light"
        title="Szerkesztés"
      >
        <FontAwesomeIcon icon={faEdit} />
      </NavLink>
    </div>
  )
}
