import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default connect(mapStateToProps)(function Home (props) {
  return (
    <div>
      <h2 className="text-center">
        {props.session.signedIn ? `Szia ${(props.session.userDetails && props.session.userDetails.name) || props.session.user.email}` : ''}
      </h2>
    </div>
  )
})
