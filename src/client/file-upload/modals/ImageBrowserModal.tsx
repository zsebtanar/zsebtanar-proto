import React from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { useDialog } from 'client/overlay/providers'
import { isAdvancedUploadSupported } from 'client/generic/utils/browser'
import { DnDOverlay } from '../components/DnDOverlay'
import { clipboardToFile, checkFileType, checkFileSize } from '../utils/file'
import { useDocumentEvent } from 'client/generic/hooks'
import { ResourceFile } from 'client/file-upload/types'

export function ImageBrowserModal() {
  const { closeDialog } = useDialog()

  const close = () => closeDialog()

  const fileSelect = event => {
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
    if (!files.every(checkFileType)) {
      return // 'Érvénytelen fájlformátum'
    }
    if (!files.every(checkFileSize, files)) {
      return // 'Túl nagy fájl'
    }

    // FIXME: map(this.props.addResource, files)
  }

  useDocumentEvent('drop', fileSelect)
  useDocumentEvent('paste', fileSelect)

  const images = []

  return (
    <div>
      {isAdvancedUploadSupported && <DnDOverlay />}
      <Dialog className="file-manager" size="large">
        <DialogHeader onClose={close}>Képek</DialogHeader>
        <DialogBody>
          {images?.length ? (
            <div className="msg-block">Nincs feltöltött fájl.</div>
          ) : (
            <div>
              {images.map(([]) => (
                <ImageResource file={null} />
              ))}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="form-group">
            <div className="input-group add-file-to-exercise">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="add-file-input"
                  onChange={fileSelect}
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

///

interface ImageResourceProps {
  id: string
  file: ResourceFile
  onSelect: (id: string, file: ResourceFile) => void
}

function ImageResource({ id, file, onSelect }: ImageResourceProps) {
  return (
    <button
      key={id}
      className="m-1 float-left btn btn-light"
      title={file.name}
      onClick={() => onSelect(id, file)}
    >
      <figure className="figure">
        <div className="img" style={{ backgroundImage: `url(${file.url})` }} />
        <figcaption className="figure-caption text-center text-truncate">{file.name}</figcaption>
      </figure>
    </button>
  )
}
