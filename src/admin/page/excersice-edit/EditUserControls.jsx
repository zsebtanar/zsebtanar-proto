import { pathOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import Button from 'shared/component/general/Button'
import UserControlAdmin from 'shared/component/userControls/UserControlAdmin'
import Link from 'shared/component/general/Link'
import { openUserControlSelectorModal } from 'shared/store/actions/modal'
import { connect } from 'react-redux'
import { names } from 'shared/component/userControls/controlTypes'

export default connect(undefined, { openUserControlSelectorModal })(
  class EditUserControls extends React.Component {
    constructor(props) {
      super(props)
      this.newProps(props)
    }

    componentWillReceiveProps(nextProps) {
      this.newProps(nextProps)
    }

    newProps(props) {
      const controls = pairsInOrder(props.controls)
      this.state = {
        controls,
        activeItem: (controls.length && controls[controls.length-1])
      }
    }

    addItem = () => this.props.openUserControlSelectorModal({ onUpdate: type => this.props.onAdd(type) })

    selectItem = activeItem => () => this.setState({ activeItem })

    removeUserControl = key => () => this.props.onRemove(key)

    render() {
      const { controls, activeItem } = this.state
      const [activeKey] = (activeItem || [])
      return (
        <div className="row">
          <div className="col-3">
            <div className="nav flex-column nav-pills" role="tablist">
              {controls.map(item => (
                <Link
                  key={item[0]}
                  className={`nav-link ${activeKey === item[0] ? 'active' : ''}`}
                  role="tab"
                  onAction={this.selectItem(item)}
                >
                  {names[item[1].controlType]}
                </Link>
              ))}
              <hr />
              <Button title="Add user control" className="btn btn-sm btn-outline-secondary" onAction={this.addItem}>
                <i className="fa fa-plus" /> Új mező
              </Button>
            </div>
          </div>
          <div className="col-9">
            <div className="tab-content px-3 pt-3">
              <div className="tab-pane active" role="tabpanel">
                {activeKey && this.renderUserControlItem(activeItem)}
                {!activeKey && <div className="alert alert-info">Kérlek hozz létre legalább egy bevitel mezőt</div>}
              </div>
            </div>
          </div>
        </div>
      )
    }

    renderUserControlItem = ([key, item]) => {
      const ex = this.props.exercise
      const controlType = pathOr('', ['controlType'], item)
      const controlProps = pathOr('', ['controlProps'], item)
      const solution = pathOr('', ['solutions', key], ex)

      return (
        <div key={key}>
          <div className="d-flex justify-content-end">
            <Button className="btn btn-sm btn-outline-danger mx-1" onAction={this.removeUserControl(key)}>
              <i className="fa fa-ban" /> Mező törlése
            </Button>
          </div>
          <hr />
          {pathOr(false, ['controlType'], item) ? (
            <UserControlAdmin
              controlType={controlType}
              controlProps={{
                name: key,
                value: { ...controlProps, solution },
                onChange: this.props.onUpdate,
                required: true
              }}
            />
          ) : null}
        </div>
      )
    }
  }
)
