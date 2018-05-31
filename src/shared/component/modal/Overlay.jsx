import React from 'react'
import { identity, pipe } from 'ramda'
import { connect } from 'react-redux'
import { closeModal } from 'shared/store/actions/modal'

const mapStateToProps = state => state.app.modal
const body = window.document.body

export const Overlay = connect(mapStateToProps, { closeModal })(
  /**
   * @return {null|Element|XML}
   */
  function Overlay({ modals, closeModal }) {
    if (!modals.length) {
      body.classList.remove('modal-open')
      return null
    } else {
      body.classList.add('modal-open')
      return (
        <div>
          <div className="modal-backdrop fade show" />
          {modals.map(({ modal: Modal, id, parameters }, idx) => {
            const close = pipe(parameters.onClose, () => closeModal(id))
            const hasBackdropClose = !parameters.disableBackdropClose
            const activeModal = modals.length - 1 === idx ? 'active-modal' : ''
            const handler = hasBackdropClose
              ? e => e.target === e.currentTarget && close()
              : identity

            return (
              <div
                key={id}
                className={`d-block modal fade show ${activeModal}`}
                role="dialog"
                onClick={handler}
              >
                <Modal {...parameters} close={close} />
              </div>
            )
          })}
        </div>
      )
    }
  }
)
