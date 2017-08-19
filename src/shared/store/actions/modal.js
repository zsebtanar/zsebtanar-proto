import { identity } from 'ramda'
import AlertModal from 'shared/component/modal/AlertModal'
import InputModal from 'shared/component/modal/InputModal'
import MarkdownHelpModal from 'shared/component/modal/MarkdownHelpModal'
import ProviderSignUp from 'shared/component/modal/ProviderSignUp'
import FileManager from 'shared/component/modal/fileManager/FileManager'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export function openModal (modal, parameters) {
  return {
    type: OPEN_MODAL,
    payload: {modal, parameters}
  }
}

export function closeModal (payload) {
  return {type: CLOSE_MODAL, payload}
}

export function openAlertModal (params) {
  return openModal(AlertModal, {title: 'Alert', text: '', element: undefined, onClose: identity, ...params})
}

export function openMarkdownHelpModal (params) {
  return openModal(MarkdownHelpModal, {onClose: identity, ...params})
}

export function openProviderSignUp (params) {
  return openModal(ProviderSignUp, {
    onClose: identity,
    onSave: identity,
    data: {name: '', email: ''},
    requestPassword: false,
    ...params
  })
}

export function openInputModal (params) {
  return openModal(InputModal, {
    title: 'Input',
    label: 'Value',
    value: '',
    onClose: identity,
    onUpdate: identity,
    ...params
  })
}

export function openFileManager (params) {
  return openModal(FileManager, {
    onClose: identity,
    onSelect: identity,
    ...params
  })
}
