import React from 'react'
import { NavLink } from 'react-router-dom'
import { ExerciseModel } from 'shared/exercise/types'
import { exerciseDataService } from '../services/exercise'
import { faEdit, faClone, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid } from 'client/generic/components/grid/Grid'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'

export function ExerciseGrid(): JSX.Element {
  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Feladatok</h3>
        <NavLink exact to="/exercise/add" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faPlus} /> Új Feladat
        </NavLink>
      </div>
      <Grid
        dataSource={new FireStoreGridDS(exerciseDataService)}
        columnDefs={[
          { title: '#', width: 100, renderer: (data, row, idx) => idx + 1 },
          { key: 'title', title: 'Név' },
          { title: 'Opciók', width: 200, renderer: (_, row) => renderListItem(row) },
        ]}
      />
    </div>
  )
}

const renderListItem = (item: ExerciseModel) => {
  return (
    <div className="text-center">
      <NavLink
        exact
        to={`/exercise/edit/${item.id}?clone`}
        className="btn btn-sm btn-light"
        title="Deladat másolása"
      >
        <FontAwesomeIcon icon={faClone} />
      </NavLink>
      &nbsp;
      <NavLink
        exact
        to={`/exercise/edit/${item.id}`}
        className="btn btn-sm btn-light"
        title="Feladat szerkesztése"
      >
        <FontAwesomeIcon icon={faEdit} />
      </NavLink>
    </div>
  )
}
