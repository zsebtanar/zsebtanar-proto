import * as React from 'react'
import { connect } from 'react-redux'
import { Button } from 'client-common/component/general/Button'
import { deleteUser } from 'client-common/store/actions/auth'
import { openConfirmModal } from 'client-common/store/actions/modal'
import { Icon } from 'client-common/component/general/Icon'
import { pipe } from 'ramda'
import { setupPage } from '../../client-common/component/hoc/setupPage'

///

interface StateProps {
  session: state.Session
}

interface DispatchProps {
  deleteUser: typeof deleteUser
  openConfirmModal: typeof openConfirmModal
}

const mapStateToProps = state => ({
  session: state.app.session
})

const mapDispatchToProps = {
  deleteUser,
  openConfirmModal
}

///

export const Profile = pipe(
  setupPage(),
  connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )
)(
  class extends React.PureComponent<StateProps & DispatchProps> {
    private deleteProfile = () => {
      const { deleteUser, openConfirmModal } = this.props
      openConfirmModal({
        buttonType: 'danger',
        content: (
          <div>
            <div className="alert alert-danger d-flex align-items-center">
              <Icon fa="exclamation-triangle" size="4x" />
              <p className="ml-4 mb-0">
                Figyelem! <br />A folyamat során visszafordíthatatlanul töröljük a felhasználói
                adataidat és minden eddig elér eredményeidet.
              </p>
            </div>
            <p>Biztos törölni szeretnéd a profilod?</p>
          </div>
        ),
        onSuccess: deleteUser
      })
    }

    render() {
      const { user } = this.props.session
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
              <dd className="col-sm-7">
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </dd>
            </dl>
            <hr className="my-5" />
            <p className="text-right">
              <Button className="btn-danger" onAction={this.deleteProfile} icon="trash">
                Felhasználói fiók törlése
              </Button>
            </p>
          </div>
        </div>
      )
    }
  }
)
