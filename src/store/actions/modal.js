import {identity} from 'ramda'
import AlertModal from '../../component/modal/AlertModal'

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

export function openAlertModal(title='Alert', text='', onClose=identity) {
  return openModal(AlertModal, {title, text, onClose: onClose})
}