import { __, assocPath, dissoc, dissocPath, evolve, keys, merge, path, pathOr, values } from 'ramda'
import { uid } from 'shared/util/uuid'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'shared/component/general/Icon'
import { openUserControlModal } from 'shared/store/actions/modal'
import { Dropdown, DropdownMenu, DropdownToggle } from 'shared/ui/Dropdown'
import { NAMES as CONTROL_TYPES } from 'shared/component/userControls/controlTypes'
import { UserControlItem } from './UserControlItem'
import { Sortable } from 'shared/component/general/Sortable'
import { listToOrderedObject } from '../../../shared/util/fn'

const controlTypes = keys(CONTROL_TYPES).sort()

function mapStateToProps(state) {
  return {
    resources: state.exerciseEdit.resources
  }
}

export default connect(mapStateToProps, { openUserControlModal })(
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

    removeUserControl = key =>
      this.setValue(
        evolve({
          controls: dissoc(key),
          solutions: dissoc(key)
        })
      )

    orderUpdate = list => {
      this.setValue(assocPath(['controls'], listToOrderedObject(list)))
    }

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
            {controls.length ? (
              <Sortable
                list={controls}
                itemComponent={UserControlItem}
                onChange={this.orderUpdate}
                itemProps={{
                  resources: this.props.resources,
                  editControl: this.openEditUserControl,
                  removeControl: this.openRemoveUserControl,
                  solutions: this.props.solutions
                }}
              />
            ) : (
              <div className="alert alert-warning">
                Kérlek hozz létre legalább egy bevitel mezőt
              </div>
            )}
          </div>

          <Dropdown className="col-6 mx-auto btn-group" dropUp>
            <DropdownToggle
              className="btn btn-sm btn-outline-primary"
              title="Beviteli mező hozzáadása"
            >
              <Icon fa="plus" /> Beviteli mező hozzáadása
            </DropdownToggle>
            <DropdownMenu>{controlTypes.map(this.renderMenuItems)}</DropdownMenu>
          </Dropdown>
        </div>
      )
    }

    renderMenuItems = type => (
      <a href="#" className="dropdown-item" key={type} onClick={this.openAddUserControl(type)}>
        {CONTROL_TYPES[type]}
      </a>
    )
  }
)
