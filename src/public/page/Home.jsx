import React from 'react'
import { connect } from 'react-redux'
import MainClassificationSelector from 'public/component/MainClassificationSelector'
import { NavLink } from 'react-router-dom'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default connect(mapStateToProps)(function Home (props) {
  return (
    <div>
      <div className="jumbotron mb-5">
        {
          props.session.signedIn
            ? <h1 className="display-4">Szia {(props.session.userDetails && props.session.userDetails.name) || props.session.user.email}</h1>
            : <div className="text-center">
              <p className="text-muted">Regisztrálj</p>
              <NavLink className="btn btn-lg btn-outline-primary my-1" to="sign-up">Diák vagyok</NavLink>&nbsp;
              <NavLink className="btn btn-lg btn-outline-primary my-1" to="sign-up">Tanár vagyok</NavLink>
              <p className="text-muted my-3">--- vagy ---</p>
              <NavLink className="btn btn-link" to="sign-in">Jelentkezz be</NavLink>
            </div>
        }
        <div className="my-5">
          <div className="input-group input-group-lg">
            <input type="text" className="form-control"/>
            <span className="input-group-addon"><i className="fa fa-lg fa-search"/></span>
          </div>
        </div>
      </div>

      <MainClassificationSelector/>
    </div>
  )
})
