import * as React from 'react'
import { assocPath, dissoc, dissocPath, evolve, keys, path, pathOr, values } from 'ramda'
import { uid } from 'client-common/util/uuid'
import { fMerge, pairsInOrder } from 'shared/util/fn'
import { connect } from 'react-redux'
import { Icon } from 'client-common/component/general/Icon'
import { openUserControlModal } from 'client-common/store/actions/modal'
import { Dropdown} from 'client-common/component/general/dropdown/Dropdown'
import { NAMES as CONTROL_TYPES } from 'client-common/component/userControls/controlTypes'
import { DropdownMenu } from '../../../client-common/component/general/dropdown/DropdownMenu'
import { DropdownToggle } from '../../../client-common/component/general/dropdown/DropdownToggle'
import { UserControlItem } from './UserControlItem'
import { Sortable } from 'client-common/component/general/Sortable'
import { listToOrderedObject } from 'shared/util/fn'

const controlTypes = keys(CONTROL_TYPES).sort()

function mapStateToProps(state) {
  return {
    resources: state.resources.data
  }
}

export const UserControlList = connect(
  mapStateToProps,
  { openUserControlModal }
)(
  class UserControlList extends React.Component<any, any> {
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
          controls: { [key]: fMerge(dissocPath(['controlProps', 'solution'], value)) },
          solutions: fMerge({ [key]: path(['controlProps', 'solution'], value) })
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
