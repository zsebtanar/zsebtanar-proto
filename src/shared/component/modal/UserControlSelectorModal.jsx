import { keys } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import Button from '../general/Button'
import { names, SIMPLE_TEXT } from 'shared/component/userControls/controlTypes'

import { openFileManager, openMarkdownHelpModal } from 'shared/store/actions/modal'

export default connect(undefined, { openFileManager, openMarkdownHelpModal })(
  class UserControlSelectorModal extends React.Component {
    state = { value: SIMPLE_TEXT }

    update = e => {
      if (e) e.preventDefault()
      this.props.onUpdate(this.state.value)
      this.props.close()
    }

    changeInput = e => {
      this.setState({ value: e.currentTarget.value })
    }

    render() {
      const props = this.props
      return (
        <div className="modal-dialog" role="document">
          <form onSubmit={this.update}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                  <span aria-hidden={true} onClick={props.close}>
                    &times;
                  </span>
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-3 col-form-label">Mező típus:</label>
                  <div className="col-6">
                    <select className="form-control" onChange={this.changeInput} required defaultValue={SIMPLE_TEXT}>
                      {keys(names)
                        .sort()
                        .map(type => (
                          <option key={type} value={type}>
                            {names[type]}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer text-center">
                <Button onAction={props.close}>Mégsem</Button>
                <Button submit primary onAction={this.update}>
                  Kész
                </Button>
              </div>
            </div>
          </form>
        </div>
      )
    }
  }
)
