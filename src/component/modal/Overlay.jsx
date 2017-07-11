import { pipe } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../../store/actions/modal'

const mapStateToProps = (state) => state.modal
const body = window.document.body

export default connect(mapStateToProps, {closeModal})(
  function Overlay ({modal, parameters, closeModal}) {
    if (!modal) {
      body.className = body.className.replace(/\b(\s*modal-open\s*)\b/, '')
      return null
    } else {
      body.className += ' modal-open'
      const close = pipe(closeModal, parameters.onClose)
      const Modal = modal

      return (<div
        className="modal fade show"
        role="dialog"
        style={{display: 'block'}}
      >
        <div className="modal-backdrop fade show" onClick={close}/>
        <Modal {...parameters} close={close}/>
      </div>)
    }
  })
