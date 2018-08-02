import * as React from 'react'
import { reduceP } from 'shared/util/fn'
import { imageUpload } from 'client-common/services/images'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'

export class FileUploadModal extends React.Component<any, any> {
  state = {
    result: undefined,
    done: undefined,
    error: undefined
  }

  componentDidMount() {
    reduceP(
      (acc, [id, data]) => {
        return imageUpload('exercise', data.file, ss =>
          this.setState({ [id]: ss.bytesTransferred / ss.totalBytes * 100 })
        ).then(res => {
          this.setState({ [id]: 'done' })
          return { ...acc, [id]: res }
        })
      },
      {},
      this.props.resources
    )
      .then(result => this.setState({ done: true, result }))
      .catch(error => this.setState({ error }))
  }
  success = () => {
    const { onSuccess, close } = this.props
    close()
    onSuccess(this.state.result)
  }

  render() {
    const { resources } = this.props

    return (
      <div className={`modal-dialog`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Fájl feltöltés</h5>
          </div>
          <div className="modal-body">
            <ul>{resources.map(this.renderFile)}</ul>
            {this.renderSuccess()}
            {this.renderError()}
          </div>
        </div>
      </div>
    )
  }

  renderFile = ([id, data]) => {
    const state = this.state[id]
    return (
      <li className="d-flex" key={id}>
        <div>{data.name}</div>
        <div>
          {state === undefined && <Icon fa="clock-o" />}
          {state === 'done' && <Icon fa="check" />}
          {state >= 0 &&
            state <= 100 && (
              <div className="progress" style={{ height: '20px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${state}%` }}
                  aria-valuenow={state}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
        </div>
      </li>
    )
  }

  renderSuccess() {
    if (this.state.done) {
      return (
        <div>
          <div className="alert alert-success my-3">Sikeres fájl feltöltés</div>
          <div className="text-center">
            <Button onAction={this.success}>Szerkesztés folytatása</Button>
          </div>
        </div>
      )
    }
  }

  renderError() {
    if (this.state.error) {
      return (
        <div>
          <div className="alert alert-danger">
            Hiba történt!<br />
            <pre>{JSON.stringify(this.state.error, null, 3)}</pre>
          </div>
          <div className="text-center">
            <Button onAction={this.props.close}>Bezárás</Button>
          </div>
        </div>
      )
    }
  }
}

// default export for dynamic import
export default FileUploadModal
