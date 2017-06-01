import * as React from 'react'
import {connect} from 'react-redux'
import {signUp} from '../../store/actions/auth'


const mapStateToProps = (state) => ({
  auth: state.auth,
  session: state.session
})

export default connect(mapStateToProps, {signUp})(function (props) {
  let nameField
  let emailField
  let pwField

  const onSubmit = (e) => {
    e.preventDefault()
    props.signUp(
      nameField.value,
      emailField.value,
      pwField.value
    )
  }

  return (<div>
    <h1>Sign-up</h1>
    {
      props.session && props.session.error
        ? <div className="alert alert-danger" role="alert">{props.session.error.message}</div>
        : ''
    }
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          ref={inp => emailField = inp}/>
        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
          ref={inp => pwField = inp}/>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword2">Password again</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword2"
          placeholder="Password"/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>)
})