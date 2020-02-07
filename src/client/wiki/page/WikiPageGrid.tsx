import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid } from 'client/generic/components/grid'
import { WikiPageModel } from 'client/wiki/types'
import { wikiPageService } from 'client/wiki/services/wikiPageService'
import { FireStoreGridDS } from 'client/generic/services'
import { Icon } from 'client/generic/components'

export function WikiPageGrid() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Wiki oldalak</h3>
          <NavLink exact to="/wiki-page/add" className="btn btn-outline-secondary">
            <i className="fa fa-plus" /> Új Wiki oldal
          </NavLink>
        </div>
        <Grid
          dataSource={new FireStoreGridDS(wikiPageService)}
          columnDefs={[
            { title: '#', width: 100, renderer: (data, row, idx) => idx + 1 },
            { key: 'title', title: 'Név' },
            { title: 'Opciók', width: 200, renderer: (_, row) => renderListItem(row) }
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
          to={`/wiki-page/add/${item.id}`}
          className="btn btn-sm btn-light"
          title="Wiki oldal másolása"
        >
          <Icon fa="clone" />
        </NavLink>
        &nbsp;
        <NavLink
          exact
          to={`/wiki-page/edit/${item.id}`}
          className="btn btn-sm btn-light"
          title="Wiki oldal szerkesztése"
        >
          <Icon fa="edit" />
        </NavLink>
      </div>
    )
  }
