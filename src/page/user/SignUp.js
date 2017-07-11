import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { signUp } from '../../store/actions/auth'
import Button from '../../component/general/Button'

const mapStateToProps = (state) => ({
  auth: state.auth,
  session: state.session
})

export default withRouter(connect(mapStateToProps, {signUp})(function (props) {
  let nameField
  let emailField
  let pwField

  const onSubmit = (e) => {
    e.preventDefault()
    props
      .signUp(
        emailField.value,
        pwField.value,
        {name: nameField.value}
      )
      .then(() => props.history.push('/'))
  }

  return (<div className="col-6 offset-3">
    <h1>Sign-up</h1>
    {
      props.session && props.session.error
        ? <div className="alert alert-danger" role="alert">{props.session.error.message}</div>
        : ''
    }
    <form onSubmit={onSubmit} className="my-5">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="id-username"
          aria-describedby="emailHelp"
          placeholder="Enter username"
          ref={inp => { nameField = inp }}/>
      </div>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          id="id-email"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          ref={inp => { emailField = inp }}/>
        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          id="id-pw-1"
          placeholder="Password"
          ref={inp => { pwField = inp }}/>
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          id="id-pw-2"
          placeholder="Password"/>
      </div>
      <Button submit primary>Submit</Button>
    </form>
  </div>)
}))
