import { __, all, contains, filter, invoker, lte, map, pipe, prop, propEq } from 'ramda'
import { connect } from 'react-redux'
import React from 'react'
import { getFileUrl, imageUpload } from 'shared/services/images'
import { isAdvancedUploadSupported } from 'shared/util/check'
import { DnDOverlay } from 'shared/component/modal/utils/DnDOverlay'
import { pairsInNameOrder } from 'shared/util/fn'
import { addResource } from 'admin/store/exerciseEdit'

const validFileTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/webp']

const maxFileSize = 1024 * 1024 * 3 // 3Mb

const getAsFile = invoker(0, 'getAsFile')

const clipboardToFile = pipe(filter(propEq('kind', 'file')), map(getAsFile))

function mapStateToProps(state) {
  return {
    resources: state.exerciseEdit.resources
  }
}

const mapDispatcherToProps = {
  addResource
}

export const ExerciseImageDialog = connect(mapStateToProps, mapDispatcherToProps)(
  class extends React.Component {
    state = { error: undefined }

    fileSelect = event => {
      const files = event.dataTransfer
        ? event.dataTransfer.files
        : event.clipboardData
          ? clipboardToFile(event.clipboardData.items)
          : event.currentTarget.files

      if (!files.length) return

      // TODO: fájlok ellenőrzése
      if (!all(pipe(prop('type'), contains(__, validFileTypes)), files)) {
        return // 'Érvénytelen fájlformátum'
      }
      if (!all(pipe(prop('size'), lte(__, maxFileSize)), files)) {
        return // 'Túl nagy fájl'
      }

      map(this.props.addResource, files)
    }

    upload = () => {
      this.setState({ uploadState: 'upload' })
      Promise.all(map(file => imageUpload('common', file), this.state.uploadFiles)).then(() => {
        this.setState({ uploadState: 'done' })
        this.loadFiles()
      })
    }

    selectImage = data => e => {
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
          <div className="modal-dialog modal-lg file-manager" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Képek</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                  <span aria-hidden={true} onClick={props.close}>
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">{this.renderContent()}</div>
              <div className="modal-footer">
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
                      <button className="custom-file-label btn btn-block" htmlFor="add-file-input">
                        Fájl hozzáadása
                      </button>
                    </div>
                  </div>
                  <small id="passwordHelpInline" className="text-muted">
                    csak <code>jpg</code>, <code>png</code>, <code>gif</code> és <code>webp</code> tölthető fel,<br />a maximális képmáret 3Mb
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    renderContent() {
      const images = pairsInNameOrder(this.props.resources)
      if (!images.length) {
        return <div className="msg-block">Nincs feltöltött fájl.</div>
      } else {
        return <div>{images.map(this.renderImage)}</div>
      }
    }

    renderImage = ([id, file]) => {
      return (
        <a
          href=""
          key={id}
          className="m-1 float-left btn btn-light"
          title={file.name}
          onClick={this.selectImage({id, file})}
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
