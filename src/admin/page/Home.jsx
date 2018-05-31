import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  session: state.app.session
})

export const Home = connect(mapStateToProps)(function Home(props) {
  const { signedIn, user } = props.session
  return (
    <div className="msg-block">
      <h2 className="text-center">
        {signedIn && `Szia ${user.displayName || user.email}`}
        {!signedIn && (
          <div>
            <div>Üdv a Zsebtanár oldalon!</div>
            <div>
              Kérlek <a href="/">jelentkezz be</a>.
            </div>
          </div>
        )}
      </h2>
    </div>
  )
})
