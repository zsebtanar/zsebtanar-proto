import React from 'react'
import { isAdvancedUploadSupported } from 'client/generic/utils/browser'
import { DnDOverlay } from '../components/DnDOverlay'
import { AddFileButton } from '../components/AddFileButton'
import { useManageAssetsDispatch, useManageAssets } from '../providers/ManageAssetProvider'
import { useGetAssetByGroup } from '../services/assets'
import { FileUploadModal } from './FileUploadModal'
import { useDialog } from '../../overlay/providers/DialogProvider'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { useFileDrop } from '../../generic/hooks/events'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { DialogBody } from 'client/overlay/components/base/DialogBody'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { DialogFooter } from 'client/overlay/components/base/DialogFooter'

export function AssetBrowserModal(): JSX.Element {
  const { closeModal } = useDialog()
  const { group } = useManageAssets()
  const { openModal } = useOverlayDispatch()
  const { addFiles } = useManageAssetsDispatch()
  const {
    isPending,
    isLoading,
    isSuccess,
    result,
    hasNoResult,
    hasError,
    error,
  } = useGetAssetByGroup(group)
  useFileDrop(addFiles)

  const close = () => closeModal()

  const selectFiles = ({ value: files }) => {
    addFiles(files)
    openModal(<FileUploadModal />)
  }

  return (
    <div>
      {isAdvancedUploadSupported && <DnDOverlay />}
      <Dialog className="file-manager" size="large">
        <DialogHeader onClose={close}>Képek</DialogHeader>
        <DialogBody>
          {isPending || (isLoading && <Loading />)}
          {isSuccess || (hasNoResult && <div className="msg-block">Nincs feltöltött fájl.</div>)}
          {hasError && <Alert>{JSON.stringify(error)}</Alert>}
          {isSuccess && result?.length && (
            <div>
              {result.map((file) => (
                <button
                  key={file.id}
                  className="m-1 float-left btn btn-light"
                  title={file.fileName}
                  onClick={() => closeModal(file)}
                >
                  <figure className="figure">
                    <img className="img-thumbnail" src={file.url} alt={file.fileName} />
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
