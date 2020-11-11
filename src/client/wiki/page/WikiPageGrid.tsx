import React from 'react'
import { NavLink } from 'react-router-dom'
import { WikiPageModel } from 'client/wiki/types'
import { wikiPageService } from 'client/wiki/services/wikiPageService'
import { Plus as PlusIcon, Edit as EditIcon, Copy as CopyIcon } from 'react-feather'
import { Grid } from 'client/generic/components/grid/Grid'
import { FireStoreGridDS } from '../../generic/services/fireStoreGridDS'
import { Icon } from 'client/generic/components/icons/Icon'

export function WikiPageGrid(): JSX.Element {
  return (
    <div className="container my-5">
      <div className="btn-toolbar justify-content-between align-items-center">
        <h3>Wiki oldalak</h3>
        <NavLink exact to="/wiki-page/add" className="btn btn-outline-secondary">
          <Icon icon={PlusIcon} /> Új Wiki oldal
        </NavLink>
      </div>
      <Grid
        dataSource={new FireStoreGridDS(wikiPageService)}
        columnDefs={[
          { title: '#', width: 100, renderer: (data, row, idx) => idx + 1 },
          { key: 'title', title: 'Név' },
          {
            title: 'Opciók',
            width: 200,
            renderer: (_, row) => renderListItem(row as WikiPageModel),
          },
        ]}
      />
    </div>
  )
}

const renderListItem = (item: WikiPageModel) => {
  return (
    <div className="text-center">
      <NavLink
        exact
        to={`/wiki-page/edit/${item.id}?clone`}
        className="btn btn-sm btn-light"
        title="Wiki oldal másolása"
      >
        <Icon icon={CopyIcon} />
      </NavLink>
      &nbsp;
      <NavLink
        exact
        to={`/wiki-page/edit/${item.id}`}
        className="btn btn-sm btn-light"
        title="Wiki oldal szerkesztése"
      >
        <Icon icon={EditIcon} />
      </NavLink>
    </div>
  )
}
