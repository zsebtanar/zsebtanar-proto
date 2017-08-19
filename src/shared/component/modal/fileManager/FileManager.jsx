import { __, all, contains, filter, invoker, lte, map, pipe, prop, propEq, values } from 'ramda'
import React from 'react'
import { getFiles, getFileUrl, imageUpload } from 'shared/services/images'
import Button from 'shared/component/general/Button'
import { isAdvancedUpload } from 'util/check'
import DnDOverlay from 'shared/component/modal/fileManager/DnDOverlay'
import Loading from 'shared/component/general/Loading'

const validFileTypes = [
  'image/gif', 'image/png', 'image/jpeg', 'image/webp'
]

const maxFileSize = 1024 * 1024 * 3 // 3Mb

const getAsFile = invoker(0, 'getAsFile')

const clipboardToFile = pipe(filter(propEq('kind', 'file')), map(getAsFile))

export default (class FileManager extends React.Component {
  state = {
    fs: undefined,
    fsLoading: false,
    fsError: undefined,
    uploadState: 'select',
    uploadFiles: undefined,
    uploadError: undefined,
    activeTab: 0
  }

  selectTab = activeTab => event => {
    event.preventDefault()
    this.setState({activeTab})
  }

  fileSelect = event => {
    const files = event.dataTransfer ? event.dataTransfer.files
      : event.clipboardData ? clipboardToFile(event.clipboardData.items)
      : event.currentTarget.files

    if (!files.length) return

    if (!all(pipe(prop('type'), contains(__, validFileTypes)), files)) {
      return this.setState({uploadState: 'error', uploadError: 'Érvénytelen fájlformátum', activeTab: 1})
    }
    if (!all(pipe(prop('size'), lte(__, maxFileSize)), files)) {
      return this.setState({uploadState: 'error', uploadError: 'Túl nagy fájl', activeTab: 1})
    }

    this.setState({uploadState: 'list', uploadFiles: files, activeTab: 1})
  }

  upload = () => {
    this.setState({uploadState: 'upload'})
    Promise
      .all(map(file => imageUpload('common', file), this.state.uploadFiles))
      .then(() => {
        this.setState({uploadState: 'done'})
        this.loadFiles()
      })
  }

  selectImage = (file) => (e) => {
    e.preventDefault()
    getFileUrl(file.fullPath)
      .then(url => {
        this.props.close()
        this.props.onSelect({url, file})
      })
  }
  loadFiles = () => {
    if (!this.state.fsLoading) {
      this.setState({fsLoading: true})
      getFiles()
        .then(fs => this.setState({fs, fsLoading: false}))
    }
  }
  resetUpload = () => {
    this.setState({uploadState: 'select', uploadError: undefined, uploadFiles: undefined})
  }

  componentDidMount () {
    this.loadFiles()

    if (isAdvancedUpload) {
      document.addEventListener('drop', this.fileSelect, false)
    }
    document.addEventListener('paste', this.fileSelect, false)
  }

  componentWillUnmount () {
    document.removeEventListener('drop', this.fileSelect, false)
    document.addEventListener('paste', this.fileSelect, false)
  }

  render () {
    const props = this.props
    return (<div>
        {isAdvancedUpload ? <DnDOverlay/> : ''}
        <div className="modal-dialog modal-lg file-manager" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Képek</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={props.close}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs nav-justified">
                <li className="nav-item">
                  <a className={`nav-link ${this.state.activeTab === 0 ? 'active' : ''}`} onClick={this.selectTab(0)}>Tallózás</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${this.state.activeTab === 1 ? 'active' : ''}`} onClick={this.selectTab(1)}>Feltöltés</a>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" role="tabpanel">
                  {
                    this.state.activeTab === 0
                      ? this.renderBrowser()
                      : this.renderUpload()
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBrowser () {
    return <div>
      {
        this.state.fsLoading ? <div className="msg-block"><Loading/></div>
          : this.state.fsError ? <div className="msg-block">{this.state.fsError.code}</div>
          : !this.state.fs ? <div className="msg-block">Nincs feltöltött fájl.</div>
            : <div>
              {values(this.state.fs.common).map(file =>
                <a href=""
                   key={file._key}
                   className="m-1 float-left btn btn-light"
                   title={file.name}
                   onClick={this.selectImage(file)}
                >
                  <figure className="figure">
                    <div className="img" style={{backgroundImage: `url(${file.thumbnail})`}}/>
                    <figcaption className="figure-caption text-center text-truncate">{file.name}</figcaption>
                  </figure>
                </a>
              )}
            </div>
      }
    </div>
  }

  renderUpload () {
    /* eslint-disable operator-linebreak */
    const state = this.state.uploadState
    return <div className="msg-block">
      <div className="block-item">
        {
          state === 'select' ? <div>
              <input
                type="file" onChange={this.fileSelect}
                accept="image/png, image/jpeg"
              />
              <div className="text-muted my-3">csak <code>jpg</code> <code>png</code> <code>gif</code> és
                <code>webp</code> tölthető fel,<br/>a maximális képmáret 3Mb
              </div>
            </div>
            : state === 'list' ? <div>
              <h4>Kiválasztott fájlok:</h4>
              <ul className="list-unstyled">
                {map(file =>
                    <li key={file.name}><img className="upload-thumbnail my-2" src={URL.createObjectURL(file)}
                                             alt=""/>{file.name}</li>
                  , this.state.uploadFiles)}
              </ul>
              <div>
                <Button primary onAction={this.upload}>Feltöltés indítása</Button>&nbsp;
                <Button onAction={this.resetUpload}>Mégsem</Button>
              </div>
            </div>
            : state === 'upload' ? 'Feltöltés...'
            : state === 'done' ? <div>
                <div className="alert alert-success" role="alert">A feltöltés sikeresen befejeződött</div>
                <Button onAction={this.resetUpload}>Új feltöltés</Button>
              </div>
            : state === 'error' ? <div>
                <div className="alert alert-danger" role="alert">{this.state.uploadError}</div>
                  <Button onAction={this.resetUpload}>Újra</Button>
                </div>
            : undefined
        }
      </div>
    </div>
  }
})
