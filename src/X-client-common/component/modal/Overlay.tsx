import * as React from 'react'
import { connect } from 'react-redux'
import { closeModal } from 'client-common/store/actions/modal'
import { Component } from 'react'
import { DynamicComponent } from '../util/DynamicComponent'

interface OverlayStateProps extends state.AppModal {}

interface DispatchProps {
  closeModal: (payload: any) => void
}

const body = window.document.body

const mapStateToProps = (state: any) => state.app.modal

export const Overlay = connect<OverlayStateProps, DispatchProps, void>(
  mapStateToProps,
  { closeModal }
)(
  class Overlay extends Component<OverlayStateProps & DispatchProps> {
    private backDropClose = (modal: state.Modal) => {
      const hasBackdropClose = !modal.parameters.disableBackdropClose
      if (hasBackdropClose) {
        return event => event.target === event.currentTarget && this.closeModal(modal)
      }
    }

    private closeModal = (modal: state.Modal) => () => {
      modal.parameters.onClose()
      this.props.closeModal(modal.id)
    }

    render() {
      const { modals } = this.props
      body.classList.toggle('modal-open', !!modals.length)
      if (modals.length) {
        return (
          <div>
            <div className="modal-backdrop fade show" />
            {modals.map(this.renderModal)}
          </div>
        )
      }
      return null
    }

    private renderModal = (modal, idx) => {
      const { modals } = this.props
      const { modalComponent, id, parameters } = modal
      const close = this.closeModal(modal)
      const activeModal = modals.length - 1 === idx ? 'active-modal' : ''

      return (
        <div
          key={id}
          className={`d-block modal fade show ${activeModal}`}
          role="dialog"
          onClick={this.backDropClose(modal)}
        >
          <DynamicComponent comp={modalComponent} props={{ ...parameters, close }} />
        </div>
      )
    }
  }
)
