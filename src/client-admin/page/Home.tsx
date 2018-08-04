import * as React from 'react'
import { connect } from 'react-redux'
import { isAdmin } from '../../client-common/services/user'

const mapStateToProps = state => ({
  session: state.app.session
})

export const Home = connect(mapStateToProps)(function Home(props) {
  const { signedIn, user, token } = props.session
  return (
    <div className="msg-block">
      <h2 className="text-center">
        {(!signedIn || !isAdmin(token)) ? (
          <div>
            <div>Üdv a Zsebtanár oldalon!</div>
            <div>
              Kérlek <a href="/">itt jelentkezz be</a> mint admin.
            </div>
          </div>
        ) : `Szia ${user.displayName || user.email}`}
      </h2>
    </div>
  )
})
