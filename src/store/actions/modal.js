import {identity} from 'ramda'
import AlertModal from '../../component/modal/AlertModal'
import InputModal from '../../component/modal/InputModal'
import MarkdownHelpModal from '../../component/modal/MarkdownHelpModal'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export function openModal(modal, parameters) {
  return {
    type: OPEN_MODAL,
    payload: {modal, parameters}
  }
}

export function closeModal() {
  return {type: CLOSE_MODAL}
}

export function openAlertModal(params) {
  return openModal(AlertModal, {title: 'Alert', text: '', element: undefined, onClose: identity, ...params})
}

export function openMarkdownHelpModal(params) {
  return openModal(MarkdownHelpModal, {onClose: identity, ...params})
}

export function openInputModal(params) {
  return openModal(InputModal, {title:'Input', label:'Value', value: '', onClose:identity, onUpdate:identity, ...params})
}