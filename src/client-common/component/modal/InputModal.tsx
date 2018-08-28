import * as React from 'react'
import { connect } from 'react-redux'
import { Button } from '../general/Button'
import { Markdown } from '../general/Markdown'
import { openExerciseImageDialog, openMarkdownHelpModal } from 'client-common/store/actions/modal'

function mapStateToProps(state) {
  return {
    resources: state.exerciseEdit.resources
  }
}

export const InputModal = connect(mapStateToProps, {
  openExerciseImageDialog,
  openMarkdownHelpModal
})(
  class extends React.Component<any, any> {
    state = { value: '' }

    private descriptionFiled

    update = e => {
      if (e) e.preventDefault()
      this.props.onUpdate(this.state.value)
      this.props.close()
    }

    changeInput = e => {
      this.setState({ value: e.currentTarget.value })
    }

    insertFile = () => {
      this.props.openExerciseImageDialog({
        onSelect: ({ id, file }) => {
          this.descriptionFiled.value += `@[${file.name}](${id} =100x)`
          this.setState({ value: this.descriptionFiled.value })
        }
      })
    }

    componentWillMount() {
      this.setState({ value: this.props.value })
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
                <div className="form-group">
                  <label htmlFor="id-input-modal">{props.label || 'Érték'}</label>
                  <textarea
                    autoFocus
                    id="id-input-modal"
                    className="form-control"
                    placeholder="Üres szöveg"
                    value={this.state.value || ''}
                    onChange={this.changeInput}
                    ref={inp => {
                      this.descriptionFiled = inp
                    }}
                    rows={10}
                  />
                </div>
                <div>
                  <Button
                    tabIndex={-1}
                    className="btn-link"
                    onAction={this.props.openMarkdownHelpModal}
                  >
                    Útmutató szerkesztéshez
                  </Button>

                  <Button tabIndex={-1} className="btn-link" onAction={this.insertFile}>
                    Kép beszúrása
                  </Button>
                </div>
                <div className="form-group">
                  <label>Előnézet</label>
                  <div className="card">
                    <div className="card-block">
                      <Markdown source={this.state.value || ''} resources={this.props.resources} />
                    </div>
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

// default export for dynamic import
export default InputModal