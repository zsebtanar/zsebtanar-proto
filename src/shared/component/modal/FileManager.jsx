import { map, values } from 'ramda'
import React from 'react'
import { getFiles, getFileUrl, imageUpload } from 'shared/services/images'
import Button from 'shared/component/general/Button'

export default (class FileManager extends React.Component {
  state = {
    fs: undefined,
    fsLoading: false,
    fsError: undefined,
    uploadState: 'select',
    uploadFiles: undefined,
    activeTab: 0
  }

  selectTab = activeTab => event => {
    event.preventDefault()
    this.setState({activeTab})
  }

  fileSelect = event => {
    this.setState({uploadState: 'list', uploadFiles: event.currentTarget.files})
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

  componentDidMount () {
    this.loadFiles()
  }

  loadFiles = () => {
    if (!this.state.fsLoading) {
      this.setState({fsLoading: true})
      getFiles()
        .then(fs => this.setState({fs, fsLoading: false}))
    }
  }

  render () {
    const props = this.props
    return (
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
    )
  }

  renderBrowser () {
    return <div>
      {
        this.state.fsLoading ? <div className="msg-block">Kist türelmet...</div>
          : this.state.fsError ? <div className="msg-block">{this.state.fsError.code}</div>
          : !this.state.fs ? <div className="msg-block">Nincs feltöltött fájl.</div>
            : <div>
              {values(this.state.fs.common).map(file =>
                <a href=""
                   key={file._key}
                   className="m-1 float-left btn btn-light"
                   onClick={this.selectImage(file)}
                >
                  <figure className="figure">
                    <img src={file.thumbnail} className="figure-img img-fluid rounded" alt=""/>
                    <figcaption className="figure-caption text-center">{file.name}</figcaption>
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
          state === 'select' ?
            <input type="file" onChange={this.fileSelect}/>
          : state === 'list' ?
            <div>
              <h4>Kiválasztott fájlok:</h4>
              <ul>
                {map(file =>
                    <li key={file.name}>{file.name}</li>
                  , this.state.uploadFiles)}
              </ul>
              <Button onAction={this.upload}>Feltöltés indítása</Button>
            </div>
          : state === 'upload' ?
            'Feltöltés...'
          : state === 'done' ?
            'Kész'
          : state === 'error' ?
            'Hiba'
          : undefined
        }
      </div>
    </div>
  }
})
