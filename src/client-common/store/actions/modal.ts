import { identity } from 'ramda'
import { AlertModal } from 'client-common/component/modal/AlertModal'
import { InputModal } from 'client-common/component/modal/InputModal'
import { FeedbackModal } from 'client-common/component/modal/FeedbackModal'
import { ProviderSignUp } from 'client-common/component/modal/ProviderSignUp'
import { MarkdownHelpModal } from 'client-common/component/modal/MarkdownHelpModal'
import { EquationHelpModal } from 'client-common/component/modal/EquationHelpModal'
import { UserControlModal } from 'client-common/component/modal/UserControlModal'
import { SignInModal } from 'client-common/component/modal/SignInModal'
import { SignUpModal } from 'client-common/component/modal/SignUpModal'
import { CookieModal } from 'client-common/component/modal/CookieModal'
import { ExerciseModal } from 'client-common/component/modal/ExerciseResultModal'
import { ExerciseImageDialog } from 'client-common/component/modal/ExerciseImageDialog'
import { FileUploadModal } from 'client-common/component/modal/FileUploadModal'
import { ConfirmModal } from '../../component/modal/ConfirmModal'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export function openModal(modal, parameters) {
  return {
    type: OPEN_MODAL,
    payload: { modal, parameters }
  }
}

export function closeModal(payload) {
  return { type: CLOSE_MODAL, payload }
}

export function openSignInModal(params?) {
  return openModal(SignInModal, {
    returnPath: undefined,
    message: undefined,
    onClose: identity,
    ...params
  })
}

export function openSignUpModal(params?) {
  return openModal(SignUpModal, {
    onClose: identity,
    ...params
  })
}

export function openCookieModal(params?) {
  return openModal(CookieModal, {
    onClose: identity,
    ...params
  })
}

export function openAlertModal(params?) {
  return openModal(AlertModal, {
    title: 'Alert',
    text: '',
    element: undefined,
    onClose: identity,
    ...params
  })
}

export function openConfirmModal(params?) {
  return openModal(ConfirmModal, {
    title: undefined,
    content: '',
    onClose: identity,
    onSuccess: identity,
    buttonType: undefined,
    ...params
  })
}

export function openMarkdownHelpModal(params?) {
  return openModal(MarkdownHelpModal, {
    onClose: identity,
    ...params
  })
}

export function openEquationHelpModal(params?) {
  return openModal(EquationHelpModal, { onClose: identity, ...params })
}

export function openProviderSignUp(params?): any {
  return openModal(ProviderSignUp, {
    onClose: identity,
    onSave: identity,
    data: { name: '', email: '' },
    requestPassword: false,
    ...params
  })
}

interface InputModalParams extends BaseModalParams {
  title?: string
  label?: string
  value?: string
  onUpdate?: (value: string) => void
}
export function openInputModal(params?: InputModalParams) {
  return openModal(InputModal, {
    title: 'Input',
    label: 'Value',
    value: '',
    onClose: identity,
    onUpdate: identity,
    disableBackdropClose: true,
    ...params
  })
}

export function openFileManager(params?) {
  return openModal(FileUploadModal, {
    onClose: identity,
    onSelect: identity,
    disableBackdropClose: true,
    ...params
  })
}

export function openFeedbackModal(params?) {
  return openModal(FeedbackModal, {
    onClose: identity,
    ...params
  })
}

export function openUserControlModal(params?) {
  return openModal(UserControlModal, {
    onClose: identity,
    onUpdate: identity,
    disableBackdropClose: true,
    ...params
  })
}

export function openExerciseResultModal(params?) {
  return openModal(ExerciseModal, {
    onClose: identity,
    success: false,
    ...params
  })
}

export function openExerciseImageDialog(params?) {
  return openModal(ExerciseImageDialog, {
    onClose: identity,
    onSelect: identity,
    ...params
  })
}

export function openFileUpload(params?) {
  return openModal(FileUploadModal, {
    onClose: identity,
    onSuccess: identity,
    onError: identity,
    resources: [],
    disableBackdropClose: true,
    ...params
  })
}
