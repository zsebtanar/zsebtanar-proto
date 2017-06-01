import * as React from 'react'
import {connect} from 'react-redux'
import {signIn} from '../../store/actions/auth'
import {withRouter} from 'react-router-dom'


const mapStateToProps = (state) => ({
  session: state.session
})

export default withRouter(connect(mapStateToProps, {signIn})(function (props) {
  let emailField
  let pwField

  const onSubmit = (e) => {
    e.preventDefault();
    props
      .signIn(emailField.value, pwField.value)
      .then(() => props.history.push('/'))
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
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>)
}))