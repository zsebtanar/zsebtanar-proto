import * as React from 'react'
import cx from 'classnames'
import { AddFileButton } from '../components/AddFileButton'
import {
  useManageAssetsDispatch,
  useManageAssets,
  UploadState,
} from '../providers/ManageAssetProvider'
import { formatBytes } from '../../generic/utils/file'
import { Trash2 as TrashIcon, AlertTriangle as AlertTriangleIcon } from 'react-feather'
import { useDialog } from '../../overlay/providers/DialogProvider'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { DialogBody } from 'client/overlay/components/base/DialogBody'
import { Button } from 'client/generic/components/Button'
import { ProgressBar } from 'client/generic/components/Progress'
import { DialogFooter } from 'client/overlay/components/base/DialogFooter'
import { useFileDrop } from '../../generic/hooks/events'
import { Alert } from 'client/generic/components/Alert'

import './FileUploadModal.scss'
import { Icon } from '../../generic/components/icons/Icon'

export function FileUploadModal(): JSX.Element {
  const { pendingAssets, uploadState } = useManageAssets()
  const { addFiles, removeFile, uploadFiles, reset } = useManageAssetsDispatch()
  const { closeModal } = useDialog()
  useFileDrop(addFiles)

  const close = () => closeModal()

  const selectFiles = ({ value: files }) => {
    addFiles(files)
  }
  const hasError = pendingAssets.filter(({ error }) => error).length > 0

  return (
    <div>
      <Dialog className="file-upload" size="large">
        <DialogHeader onClose={close}>Fájl feltöltés</DialogHeader>
        <DialogBody>
          {hasError && (
            <Alert type="warning">
              Csak akkor tudod elindítani a feltöltés ha törlöd a kritériumoknak nem megfelelő
              fájlokat
            </Alert>
          )}
          {uploadState === UploadState.Pending && !pendingAssets.length && (
            <div className="my-5 text-center">Nincs fájl kiválasztva</div>
          )}
          {uploadState === UploadState.Done && (
            <div className="my-5 text-center">
              <div>A feltöltés lekészült</div>
              <Button onAction={reset} btn="secondary">
                Ok
              </Button>
            </div>
          )}
          <ul className="list-unstyled">
            {pendingAssets.map(({ url, file, error, progress }) => (
              <li key={url} className={cx('p-1', 'my-1', 'd-flex', { 'has-error': error })}>
                <img
                  src={error ? '/assets/logo.png' : url}
                  alt={file.name}
                  className="img-thumbnail mr-1"
                />
                <div>
                  <div>
                    <strong>{file.name}</strong>{' '}
                    <Button
                      onAction={() => removeFile(file)}
                      btn="link"
                      small
                      className="text-danger"
                    >
                      <Icon icon={TrashIcon} />
                    </Button>
                  </div>
                  <div>size: {formatBytes(file.size)}</div>
                  {error && <div className="text-danger">{error}</div>}
                  {uploadState === UploadState.Uploading && <ProgressBar value={progress * 100} />}
                </div>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <div className="d-flex justify-content-between align-items-start w-100">
            <div className="form-group">
              <AddFileButton value={[]} name="files" onChange={selectFiles} />
              <small id="passwordHelpInline" className="text-muted">
                Csak <code>jpg</code>, <code>png</code>, <code>gif</code> és <code>webp</code>{' '}
                tölthető fel, a maximális képmáret 3Mb
              </small>
            </div>
            <Button btn="primary" submit disabled={hasError} onAction={() => uploadFiles()}>
              Feltöltés
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
