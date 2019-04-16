import { identity } from 'ramda'
import AlertModal from '../../component/modal/AlertModal'
import ConfirmModal, { ConfirmModalParams as CMP } from '../../component/modal/ConfirmModal'
import { FileUploadModalParams } from '../../component/modal/FileUploadModal'
import { WikiModalParams } from '../../component/modal/WikiModal'
import { WikiPageSelectorModalParams } from '../../component/modal/WikiPageSelectorModal'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export function openModal<T>(modalComponent: () => Promise<any>, parameters: T) {
  return {
    type: OPEN_MODAL,
    payload: { modalComponent, parameters }
  }
}

export function closeModal(payload) {
  return { type: CLOSE_MODAL, payload }
}

export function openAlertModal(params?) {
  return openModal(() => Promise.resolve(AlertModal), {
    title: 'Alert',
    text: '',
    element: undefined,
    onClose: identity,
    ...params
  })
}

interface ConfirmModalParams extends BaseModalParams, CMP {}

export function openConfirmModal(params: ConfirmModalParams) {
  return openModal(() => Promise.resolve(ConfirmModal), {
    title: undefined,
    content: '',
    onClose: identity,
    onSuccess: identity,
    buttonType: 'danger',
    ...params
  })
}

export function openSignInModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/SignInModal'),
    {
      returnPath: undefined,
      message: undefined,
      onClose: identity,
      ...params
    }
  )
}

interface ResetPasswordModalParams extends BaseModalParams {
  email?: string
}

export function openResetPasswordModal(params?: ResetPasswordModalParams) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/ResetPasswordModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openSignUpModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/SignUpModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openCookieModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/CookieModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openProviderSignUp(params?): any {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/ProviderSignUp'),
    {
      onClose: identity,
      onSave: identity,
      data: { name: '', email: '' },
      requestPassword: false,
      ...params
    }
  )
}

export function openFeedbackModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/FeedbackModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openWikiModal(params?: WikiModalParams) {
  return openModal(
    () => import(/* webpackChunkName: 'public-modal' */ 'client-common/component/modal/WikiModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

interface InputModalParams extends BaseModalParams {
  title?: string
  label?: string
  value?: string
  onUpdate?: (value: string) => void
}

export function openInputModal(params?: InputModalParams) {
  return openModal(
    () => import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/InputModal'),
    {
      title: 'Input',
      label: 'Value',
      value: '',
      onClose: identity,
      onUpdate: identity,
      disableBackdropClose: true,
      ...params
    }
  )
}

export function openMarkdownHelpModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/MarkdownHelpModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openEquationHelpModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/EquationHelpModal'),
    {
      onClose: identity,
      ...params
    }
  )
}

export function openUserControlModal(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/UserControlModal'),
    {
      onClose: identity,
      onUpdate: identity,
      disableBackdropClose: true,
      ...params
    }
  )
}

export function openExerciseImageDialog(params?) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/ImageBrowserModal'),
    {
      onClose: identity,
      onSelect: identity,
      ...params
    }
  )
}

export function openFileUpload(params: FileUploadModalParams) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/FileUploadModal'),
    {
      onClose: identity,
      onSuccess: identity,
      onError: identity,
      resources: {},
      disableBackdropClose: true,
      ...params
    }
  )
}

interface ExerciseSearchParams extends BaseModalParams {
  filterOut?: string[]
  onSuccess?: (id: string) => void
}
export function openExerciseSearch(params?: ExerciseSearchParams) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/ExerciseSearchModal'),
    {
      onClose: identity,
      onSuccess: identity,
      disableBackdropClose: true,
      ...params
    }
  )
}

export function openWikiPageSelector(params?: WikiPageSelectorModalParams) {
  return openModal(
    () =>
      import(/* webpackChunkName: 'admin-modal' */ 'client-common/component/modal/WikiPageSelectorModal'),
    {
      onClose: identity,
      onSuccess: identity,
      disableBackdropClose: true,
      ...params
    }
  )
}
