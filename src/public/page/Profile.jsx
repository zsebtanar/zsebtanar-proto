import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  session: state.app.session
})

export const Profile = connect(mapStateToProps)(function Profile(props) {
  const { user } = props.session
  return (
    <div className="profile-page row">
      <div className="col-auto picture-col">
        <img src={user.photoURL || 'assets/logo.png'} alt={'asd'} />
      </div>
      <div className="col-md data-col">
        <h2>Profil adatok</h2>
        <hr />
        <dl className="row">
          <dt className="col-sm-5">Név</dt>
          <dd className="col-sm-7">{user.displayName}</dd>

          <dt className="col-sm-5">E-mail cím</dt>
          <dd className="col-sm-7">{user.email}</dd>

          <dt className="col-sm-5">Regisztráció dátuma</dt>
          <dd className="col-sm-7">{new Date(user._created).toLocaleDateString()}</dd>
        </dl>

        <h2 className="mt-5">Statisztikák:</h2>
        <hr />

        <dl className="row">
          <dt className="col-sm-5">Megoldott feladatok száma:</dt>
          <dd className="col-sm-7">999999</dd>

          <dt className="col-sm-5">Helyes megoldások aránya</dt>
          <dd className="col-sm-7">110%</dd>
        </dl>
        <p>...</p>
      </div>
    </div>
  )
})
