import React from 'react'
import { connect } from 'react-redux'
import { pathOr, prop, propEq } from 'ramda'
import { createFeedback } from 'shared/services/feebback'
import Loading from 'shared/component/general/Loading'
import Button from 'shared/component/general/Button'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default connect(mapStateToProps)(class FeedbackModal extends React.Component {
  state = {
    state: 'init'
  }

  saveDetails = event => {
    event.preventDefault()
    const defaultSite = pathOr('public', ['params', 'site'], this.props)
    const types = [this.feedbackNoteField, this.feedbackErrorField]
    this.setState({state: 'loading'})
    createFeedback({
      type: types
        .filter(propEq('checked', true))
        .map(prop('value'))[0],
      site: defaultSite,
      email: this.emailField.value,
      description: this.descriptionField.value
    })
      .then(() => this.setState({state: 'finished'}))
  }

  render () {
    const props = this.props
    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.saveDetails}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Visszajelzés</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={props.close}>&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {this.renderContent()}
            </div>

            <div className="modal-footer text-center">
              {this.renderFooter()}
            </div>
          </div>
        </form>
      </div>
    )
  }

  renderContent () {
    switch (this.state.state) {
      case 'init':
        return this.renderForm()
      case 'loading':
        return <div className="msg-block"><Loading/></div>
      case 'finished':
        return <div className="msg-block">Köszönjük a visszajelzész.</div>
    }
  }

  renderFooter () {
    switch (this.state.state) {
      case 'init':
        return <div>
          <Button onAction={this.props.close}>Mégsem</Button>&nbsp;
          <Button submit primary>Küldés</Button>
        </div>
      case 'loading':
        return <div/>
      case 'finished':
        return <div>
          <Button onAction={this.props.close}>Bezárás</Button>
        </div>
    }
  }

  renderForm () {
    const props = this.props
    const defaultType = pathOr('note', ['params', 'note'], props)
    const email = pathOr(false, ['session', 'userDetails', 'email'], props)

    return <div>
      <div className="form-group">
        <label className="custom-control custom-radio">
          <input
            id="id-feedback-type-1"
            name="feedbackType"
            type="radio"
            value="note"
            className="custom-control-input"
            required
            defaultChecked={defaultType === 'note'}
            ref={inp => { this.feedbackNoteField = inp }}
          />
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">Megjegyzés</span>
        </label>
        <label className="custom-control custom-radio">
          <input
            id="id-feedback-type-2"
            name="feedbackType"
            type="radio"
            className="custom-control-input"
            value="error"
            required
            defaultChecked={defaultType === 'error'}
            ref={inp => { this.feedbackErrorField = inp }}
          />
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">Hibabejelentés</span>
        </label>
      </div>
      <div className="form-group">
        <input
          type="mail"
          id="id-feedback-email"
          className="form-control"
          placeholder="E-mail cím"
          defaultValue={email !== false ? email : ''}
          required
          readOnly={email !== false}
          ref={inp => { this.emailField = inp }}/>
      </div>
      <div className="form-group">
        <label htmlFor="feedback-txt">Leírás</label>
        <textarea
          id="id-feedback-txt"
          className="form-control"
          required
          rows="10"
          ref={inp => { this.descriptionField = inp }}
        />
      </div>
    </div>
  }
})
