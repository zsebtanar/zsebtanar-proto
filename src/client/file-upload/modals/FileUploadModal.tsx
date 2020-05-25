import { Button } from 'client-common/component/general/Button'
import { imageUpload, UploadedFile } from 'client/file-upload/images'
import * as React from 'react'
import { reduceP } from 'shared/util/fn'
import { Dialog } from '../../../client/modal/components/modal/Dialog'
import { DialogBody } from '../../../client/modal/components/modal/DialogBody'
import { DialogHeader } from '../../../client/modal/components/modal/DialogHeader'
import { toPairs } from 'ramda'
import { faCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

///

export interface FileUploadModalParams {
  folder: string
  onSuccess: (result: ObjectMap<UploadedFile>) => void
  onError: (error) => void
  resources: ObjectMap<state.ResourceFileData>
}

interface Props extends ui.ModalProps, FileUploadModalParams {}

interface State {
  allDone: boolean
  result: ObjectMap<string>
  progress: ObjectMap<number | string>
  error?: any
}

///

export class FileUploadModal extends React.Component<Props, State> {
  state = {
    result: undefined,
    progress: {},
    results: {},
    allDone: false,
    error: undefined
  }
  private resources: Array<[string, state.ResourceFileData]>

  constructor(props) {
    super(props)
    this.resources = toPairs(props.resources)
  }

  componentDidMount() {
    this.uploadResources()
  }

  private uploadResources() {
    const folder = this.props.folder

    reduceP(
      (acc, [id, data]) =>
        imageUpload(folder, data.file, this.onProgress(id)).then(this.onUploaded(acc, id)),
      {},
      this.resources
    )
      .then(result => this.setState({ allDone: true, result }))
      .catch(error => this.setState({ error }))
  }

  private onProgress = id => ss => {
    this.setState({
      progress: { ...this.state.progress, [id]: (ss.bytesTransferred / ss.totalBytes) * 100 }
    })
  }

  private onUploaded = (acc, id) => res => {
    this.setState({ progress: { ...this.state.progress, [id]: 'done' } })
    return { ...acc, [id]: res }
  }

  private onFinish = () => {
    const { onSuccess, close } = this.props
    close()
    onSuccess(this.state.result)
  }

  render() {
    return (
      <Dialog className="file-upload">
        <DialogHeader>Fájl feltöltés</DialogHeader>
        <DialogBody>
          <ul>{this.resources.map(this.renderFile)}</ul>
          {this.renderSuccess()}
          {this.renderError()}
        </DialogBody>
      </Dialog>
    )
  }

  renderFile = ([id, data]) => {
    const state = this.state.progress[id]
    return (
      <li className="d-flex" key={id}>
        <div>{data.name}</div>
        <div>
          {state === undefined && <FontAwesomeIcon icon={faClock} />}
          {state === 'done' && <FontAwesomeIcon icon={faCheck} />}
          {state >= 0 && state <= 100 && (
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

  private renderSuccess() {
    if (this.state.allDone) {
      return (
        <div>
          <div className="alert alert-success my-3">Sikeres fájl feltöltés</div>
          <div className="text-center">
            <Button onAction={this.onFinish}>Szerkesztés folytatása</Button>
          </div>
        </div>
      )
    }
  }

  private renderError() {
    if (this.state.error) {
      return (
        <div>
          <div className="alert alert-danger">
            Hiba történt!
            <br />
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
