import React from 'react'
import Button from '../general/Button'

import UserControlsAdmin from 'shared/component/userControls/UserControlAdmin'

export default class UserControlModal extends React.Component {
  constructor (props){
    super(props)

    this.state = {
      controlProps: props.controlProps || {}
    }
  }

  update = event => {
    if (event) event.preventDefault()
    this.props.onUpdate({
      controlProps: this.state.controlProps,
      controlType: this.props.controlType
    })
    this.props.close()
  }

  changeInput = event => {
    this.setState({
      controlProps: event.value
    })
  }

  render() {
    const props = this.props
    const controlProps = {
      value: props.controlProps,
      onChange: this.changeInput
    }

    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.update}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Beviteli mező szerkesztése</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={props.close}>
                  &times;
                </span>
              </button>
            </div>

            <div className="modal-body">
              <UserControlsAdmin controlType={props.controlType} controlProps={controlProps} />
            </div>

            <div className="modal-footer text-center">
              <Button onAction={props.close}>Mégsem</Button>
              <Button submit primary onAction={this.update}>
                Ok
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
