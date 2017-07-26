import React from 'react'
import Button from '../general/Button'
import Markdown from '../general/Markdown'

export default (class InputModal extends React.Component {
  state = { value: '' }

  update = (e) => {
    if (e) e.preventDefault()
    this.props.onUpdate(this.state.value)
    this.props.close()
  }

  componentWillMount () {
    this.setState({value: this.props.value})
  }

  changeInput = (e) => {
    this.setState({value: e.currentTarget.value})
  }

  render () {
    const props = this.props
    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.update}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={props.close}>&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="id-input-modal">{props.label || 'Érték'}</label>
                <textarea
                  autoFocus
                  id="id-input-modal"
                  className="form-control"
                  placeholder="Üres szöveg"
                  value={this.state.value || ''}
                  onChange={this.changeInput}
                  rows="10"/>
              </div>
              <div className="form-group">
                <label>Előnézet</label>
                <div className="card">
                  <div className="card-block">
                    <Markdown source={this.state.value || ''}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer text-center">
              <Button onAction={props.close}>
                Mégsem
              </Button>
              <Button submit primary onAction={this.update}>
                Kész
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }
})
