import {
  __, always,
  assocPath,
  dissoc,
  dissocPath,
  evolve,
  keys,
  merge,
  path,
  pathOr,
  values
} from 'ramda'
import { uid } from 'shared/util/uuid'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import { connect } from 'react-redux'
import Button from 'shared/component/general/Button'
import Icon from 'shared/component/general/Icon'
import { openUserControlModal } from 'shared/store/actions/modal'
import UserControls from 'shared/component/userControls/UserControl'
import { Dropdown, DropdownMenu, DropdownToggle } from 'shared/ui/Dropdown'
import { NAMES as CONTROL_TYPES } from 'shared/component/userControls/controlTypes'

export default connect(undefined, { openUserControlModal })(
  class UserControlList extends React.Component {
    addUserControl = value => {
      const key = uid()
      this.setValue(
        evolve({
          controls: controls => ({
            ...controls,
            [key]: {
              order: values(controls).length,
              ...dissocPath(['controlProps', 'solution'], value)
            }
          }),
          solutions: solutions => ({
            ...solutions,
            [key]: path(['controlProps', 'solution'], value)
          })
        })
      )
    }

    updateUserControl = (key, value) =>
      this.setValue(
        evolve({
          controls: { [key]: merge(__, dissocPath(['controlProps', 'solution'], value)) },
          solutions: merge(__, { [key]: path(['controlProps', 'solution'], value) })
        })
      )

    removeUserControl = key => this.setValue(evolve({ controls: dissoc(key) }))

    setValue = fn => {
      const data = fn(this.props)
      this.props.onChange(data)
    }

    openAddUserControl = controlType => () => {
      this.props.openUserControlModal({
        controlType,
        onUpdate: this.addUserControl
      })
    }

    openEditUserControl = key => () => {
      const props = pathOr({}, ['controls', key], this.props)
      const solution = pathOr(undefined, ['solutions', key], this.props)
      this.props.openUserControlModal({
        ...assocPath(['controlProps', 'solution'], solution, props),
        onUpdate: value => this.updateUserControl(key, value)
      })
    }

    openRemoveUserControl = key => () =>
      confirm('Biztosan, hogy törölni szeretnéd?') && this.removeUserControl(key)

    render() {
      const controls = pairsInOrder(this.props.controls)
      return (
        <div>
          <div className="list-group my-2">
            {controls.length ? controls.map(this.renderUserControl) : ''}
            {!controls.length && (
              <div className="alert alert-warning">
                Kérlek hozz létre legalább egy bevitel mezőt
              </div>
            )}
          </div>

          <Dropdown className="col-6 mx-auto">
            <DropdownToggle
              className="btn btn-sm btn-outline-primary"
              title="Beviteli mező hozzáadása"
            >
              <Icon fa="plus" /> Beviteli mező hozzáadása
            </DropdownToggle>
            <DropdownMenu>
              {keys(CONTROL_TYPES)
                .sort()
                .map(type => (
                  <a
                    href="#"
                    className="dropdown-item"
                    key={type}
                    onClick={this.openAddUserControl(type)}
                  >
                    {CONTROL_TYPES[type]}
                  </a>
                ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }

    renderUserControl = ([key, item], idx) => {
      return (
        <div
          key={key}
          className="list-group-item list-group-item-action flex-column align-items-start"
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-muted">
              {idx + 1}. <small className="text-muted">{CONTROL_TYPES[item.controlType]}</small>
            </h5>
            <div>
              <Button
                className="btn-sm btn-link text-danger"
                onAction={this.openRemoveUserControl(key)}
              >
                <Icon fa="trash" /> Törlés
              </Button>
              <Button className="btn-sm btn-link" onAction={this.openEditUserControl(key)}>
                <Icon fa="edit" /> Módosítás
              </Button>
            </div>
          </div>
          <UserControls {...item} />
        </div>
      )
    }
  }
)
