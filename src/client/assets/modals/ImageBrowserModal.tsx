import React from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { useDialog } from 'client/overlay/providers'
import { isAdvancedUploadSupported } from 'client/generic/utils/browser'
import { DnDOverlay } from '../components/DnDOverlay'
import { useDocumentEvent } from 'client/generic/hooks'
import { AddFileButton } from '../components/AddFileButton'
import { useManageAssets } from '../providers/ManageAssetProvider'
import { clipboardToFile } from '../utils/file'

export function ImageBrowserModal() {
  const { addFiles, assetList } = useManageAssets()
  const { closeModal } = useDialog()

  const close = () => closeModal()

  const selectFiles = ({ value: files }) => {
    addFiles(files)
  }

  useDocumentEvent('drop', event => addFiles(Array.from(event?.dataTransfer?.files ?? [])))
  useDocumentEvent('paste', event =>
    addFiles(clipboardToFile(Array.from(event?.clipboardData?.items ?? [])))
  )

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
              {assetList.map(file => (
                <button
                  key={file.id}
                  className="m-1 float-left btn btn-light"
                  title={file.fileName}
                  onClick={() => closeModal(file)}
                >
                  <figure className="figure">
                    <div className="img" style={{ backgroundImage: `url(${file.url})` }} />
                    <figcaption className="figure-caption text-center text-truncate">
                      {file.fileName}
                    </figcaption>
                  </figure>
                </button>
              ))}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="form-group">
            <AddFileButton value={[]} name="files" onChange={selectFiles} />
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
