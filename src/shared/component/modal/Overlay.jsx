import { pipe } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from 'shared/store/actions/modal'

const mapStateToProps = (state) => state.app.modal
const body = window.document.body

export default connect(mapStateToProps, {closeModal})(
  /**
   * @return {null|Element}
   */
  function Overlay ({modals, closeModal}) {
    if (!modals.length) {
      body.classList.remove('modal-open')
      return null
    } else {
      body.classList.add('modal-open')
      return (<div>
        <div className="modal-backdrop fade show"/>
        {
          modals.map(({modal: Modal, id, parameters}, idx) => {
            const close = pipe(() => closeModal(id), parameters.onClose)
            return <div
              key={id}
              className={`modal fade show ${(modals.length - 1) === idx ? 'active-modal' : ''}`}
              role="dialog"
              style={{display: 'block'}}
            >
              <Modal {...parameters} close={close}/>
            </div>
          })
        }
      </div>)
    }
  })
