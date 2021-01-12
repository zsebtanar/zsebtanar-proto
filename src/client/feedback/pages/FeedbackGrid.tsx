import React from 'react'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import { collectionName } from '../services/feedbackService'
import { Grid } from 'client/generic/components/grid/Grid'

const opt = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}
const dateFormatter = new Intl.DateTimeFormat('hu', opt)

export function FeedbackGrid(): JSX.Element {
  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Visszajelzések</h3>
      </div>
      <Grid
        dataSource={new FireStoreGridDS(collectionName)}
        columnDefs={[
          { title: '#', width: 50, renderer: (data, row, rowIdx) => rowIdx + 1 },
          { key: 'site', title: 'Oldal', width: 75 },
          { key: 'type', title: 'Típus', width: 75 },
          { key: 'state', title: 'Állapot', width: 75 },
          { key: 'email', title: 'E-mail', width: 150 },
          {
            key: 'created',
            title: 'Létrehozva',
            width: 200,
            renderer: renderDate,
          },
          { key: 'description', title: 'Visszajelzés szövege' },
        ]}
      />
    </div>
  )
}

function renderDate(data) {
  return data ? dateFormatter.format(data.toDate()) : ''
}
