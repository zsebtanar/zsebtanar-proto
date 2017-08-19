import * as React from 'react'
import { connect } from 'react-redux'
import { facebookSignIn, googleSignIn, signIn } from 'shared/store/actions/auth'
import { withRouter } from 'react-router-dom'
import Button from 'shared/component/general/Button'
import strings from 'shared/strings'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default withRouter(connect(mapStateToProps, {signIn, googleSignIn, facebookSignIn})(function (props) {
  let emailField
  let pwField

  const onSubmit = (e) => {
    e.preventDefault()
    props
      .signIn(emailField.value, pwField.value)
      .then(({error}) => error ? null : props.history.push('/'))
  }

  return (<div className="col-lg-6 col-md-8 mx-auto my-5">
    <h1 className="text-center">Belépés</h1>
    {
      props.session && props.session.error
        ? <div className="alert alert-danger" role="alert">{strings[props.session.error.code] || 'Nem várt hiba történt a bejelentkezés során'}</div>
        : ''
    }
    <div className="col-10 mx-auto my-5">
      <ul className="list-unstyled">
        <li className="my-1">
          <Button onAction={props.googleSignIn} className="btn btn-outline-primary btn-block">
            <i className="fa fa-lg fa-google"/> Google fiókkal
          </Button>
        </li>
        <li className="my-1">
          <Button onAction={props.facebookSignIn} className="btn btn-outline-primary btn-block">
            <i className="fa fa-lg fa-facebook"/> Facebook fiókkal
          </Button>
        </li>
      </ul>
    </div>
    <hr/>
    <p className="text-center text-muted">vagy használd az email címed</p>
    <form onSubmit={onSubmit} className="my-5 col-12">
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="E-mail"
          ref={inp => { emailField = inp }}/>
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Jelszó"
          ref={inp => { pwField = inp }}/>
      </div>
      <div className="text-center">
        <Button submit primary>Mehet</Button>
      </div>
    </form>
  </div>)
}))
