import React from 'react'
import { connect } from 'react-redux'
import MainClassificationSelector from 'public/component/MainClassificationSelector'
import Button from 'shared/component/general/Button'
import { openSignInModal, openSignUpModal } from 'shared/store/actions/modal'

const mapStateToProps = state => ({
  session: state.app.session
})

export default connect(mapStateToProps, { openSignInModal, openSignUpModal })(function Home(props) {
  return (
    <div>
      <div className="jumbotron mb-5">
        {props.session.signedIn ? (
          <h1 className="display-4">
            Szia{' '}
            {(props.session.userDetails && props.session.userDetails.name) ||
              props.session.user.email}
          </h1>
        ) : (
          <div className="text-center">
            <p className="text-muted">Regisztrálj</p>
            <Button
              className="btn btn-lg btn-outline-primary my-1"
              onAction={props.openSignUpModal}
            >
              Diák vagyok
            </Button>&nbsp;
            <Button
              className="btn btn-lg btn-outline-primary my-1"
              onAction={props.openSignUpModal}
            >
              Tanár vagyok
            </Button>
            <p className="text-muted my-3">--- vagy ---</p>
            <Button
              className="btn btn-link"
              onAction={props.openSignInModal}
            >
              Jelentkezz be
            </Button>
          </div>
        )}
        <div className="my-5">
          <div className="input-group input-group-lg">
            <input type="text" className="form-control" />
            <span className="input-group-addon">
              <i className="fa fa-lg fa-search" />
            </span>
          </div>
        </div>
      </div>

      <MainClassificationSelector />
    </div>
  )
})
