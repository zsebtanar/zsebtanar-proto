import { isAdvancedUploadSupported } from 'client-common/util/browser'
import { all, map } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { pairsInNameOrder } from 'shared/util/fn'
import { addResource } from '../../../client-admin/page/resources/resourceReducer'
import { Dialog } from '../../../client/modal/components/modal/Dialog'
import { DialogBody } from '../../../client/modal/components/modal/DialogBody'
import { DialogFooter } from '../../../client/modal/components/modal/DialogFooter'
import { DialogHeader } from '../../../client/modal/components/modal/DialogHeader'
import { FileUploadModalParams } from './FileUploadModal'
import { DnDOverlay } from '../../../client/file-upload/components/DnDOverlay'
import { checkFileSize, checkFileType, clipboardToFile } from '../../../client/file-upload/utils/file'
import ResourceFileData = state.ResourceFileData

///

interface Props extends ui.ModalProps, FileUploadModalParams {}

interface StateProps {
  resources: ResourceFileData
}

interface DispatchProps {
  addResource: typeof addResource
}

type AllProps = Props & StateProps & DispatchProps

interface State {
  error: any
  uploadFiles: unknown
}

///

function mapStateToProps(state) {
  return {
    resources: state.resources.data
  }
}

const mapDispatcherToProps = {
  addResource
}

///

export const ImageBrowserModal = connect<StateProps, DispatchProps, AllProps>(
  mapStateToProps,
  mapDispatcherToProps
)(
  class extends React.Component<any, State> {
    state = {
      uploadFiles: undefined,
      error: undefined
    }

    private fileSelect = event => {
      let files: File[]

      if (event.dataTransfer) {
        files = event.dataTransfer.files
      } else if (event.clipboardData) {
        files = clipboardToFile(event.clipboardData.items)
      } else {
        files = event.currentTarget.files
      }

      if (!files.length) return

      // TODO: fájlok ellenőrzése
      if (!all(checkFileType, files)) {
        return // 'Érvénytelen fájlformátum'
      }
      if (!all(checkFileSize, files)) {
        return // 'Túl nagy fájl'
      }

      map(this.props.addResource, files)
    }

    private selectImage = data => e => {
      e.preventDefault()
      this.props.close()
      this.props.onSelect(data)
    }

    componentDidMount() {
      if (isAdvancedUploadSupported) {
        document.addEventListener('drop', this.fileSelect, false)
      }
      document.addEventListener('paste', this.fileSelect, false)
    }

    componentWillUnmount() {
      document.removeEventListener('drop', this.fileSelect, false)
      document.addEventListener('paste', this.fileSelect, false)
    }

    render() {
      const props = this.props
      return (
        <div>
          {isAdvancedUploadSupported && <DnDOverlay />}
          <Dialog className="file-manager" size="large">
            <DialogHeader onClose={props.close}>Képek</DialogHeader>
            <DialogBody>{this.renderContent()}</DialogBody>
            <DialogFooter>
              <div className="form-group">
                <div className="input-group add-file-to-exercise">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="add-file-input"
                      onChange={this.fileSelect}
                      accept="image/png, image/jpeg"
                    />
                    <button className="custom-file-label btn btn-block">Fájl hozzáadása</button>
                  </div>
                </div>
                <small id="passwordHelpInline" className="text-muted">
                  csak <code>jpg</code>, <code>png</code>, <code>gif</code> és <code>webp</code>{' '}
                  tölthető fel,
                  <br />a maximális képmáret 3Mb
                </small>
              </div>
            </DialogFooter>
          </Dialog>
        </div>
      )
    }

    private renderContent() {
      const images = pairsInNameOrder(this.props.resources)
      if (!images.length) {
        return <div className="msg-block">Nincs feltöltött fájl.</div>
      } else {
        return <div>{images.map(this.renderImage) }</div>
      }
    }

    private renderImage = ([id, file]) => {
      return (
        <a
          href=""
          key={id}
          className="m-1 float-left btn btn-light"
          title={file.name}
          onClick={this.selectImage({ id, file })}
        >
          <figure className="figure">
            <div className="img" style={{ backgroundImage: `url(${file.url})` }} />
            <figcaption className="figure-caption text-center text-truncate">
              {file.name}
            </figcaption>
          </figure>
        </a>
      )
    }
  }
)

// default export for dynamic import
export default ImageBrowserModal
