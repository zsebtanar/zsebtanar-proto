import { all, last, pathOr, propOr, identity } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { pairsInOrder } from 'shared/util/fn'
import UserControls from 'shared/component/userControls/UserControl'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'
import { checkSolution, getHint, getPublicExercise } from 'shared/services/exercise'
import { openExerciseResultModal, openSignInModal } from 'shared/store/actions/modal'
import { withRouter } from 'react-router-dom'
import Loading from 'shared/component/general/Loading'

const mapStateToProps = state => ({
  session: state.app.session
})

export default withRouter(
  connect(mapStateToProps, { openSignInModal, openExerciseResultModal })(
    class extends React.Component {
      state = {
        solutions: [],
        hints: [],
        hintsLeft: 0,
        exerciseState: 'unchecked'
      }

      componentWillMount() {
        getPublicExercise(this.props.match.params.key).then(exercise =>
          this.setState({ exercise, hintsLeft: pathOr(0, ['hintCount'], exercise) })
        )
      }

      onSubmit = event => {
        event.preventDefault()
        if (this.state.exerciseState === 'in-progress') return

        this.setState({ exerciseState: 'in-progress', validity: {} })
        checkSolution(this.state.exercise._key, this.state.solutions).then(res => {
          const success = all(identity, res.data.valid)
          this.setState({
            exerciseState: success ? 'success' : 'fail',
            validity: res.data
          })
          this.props.openExerciseResultModal({ onClose: this.closeReusultModal, success })
        })
      }

      closeReusultModal = res => {
        switch (res) {
          case 'back':
            return this.props.history.goBack()
          case 'retry':
            return
        }
      }

      onChange = ({ name, value }) => {
        this.setState({ solutions: { ...this.state.solutions, [name]: value } })
      }

      getNextHint = () => {
        if (this.props.session.signedIn) {
          const _key = this.state.exercise._key
          const hints = this.state.hints
          getHint(_key, propOr(_key, 'key', last(hints || []))).then(hint => {
            const { hints, exercise } = this.state
            return this.setState({
              hints: hints.concat(hint),
              hintsLeft: (exercise.hintCount || 0) - (hints || []).length - 1
            })
          })
        } else {
          this.props.openSignInModal({
            returnPath: this.props.location.pathname,
            message: 'Jelentkezz be, hogy megtekinthesd a segítséget'
          })
        }
      }

      render() {
        const ex = this.state.exercise
        return (
          <div>
            {!ex && <Loading />}
            {ex &&
            ex.error && (
              <div>
                <div className="alert alert-danger">{ex.error.message || ex.error}</div>
              </div>
            )}
            {ex &&
            !ex.error && (
              <div className="row">
                <div className="col-8 mx-auto">{this.renderTask()}</div>
              </div>
            )}
          </div>
        )
      }

      renderTask() {
        const ex = this.state.exercise
        const cx = {
          unchecked: 'badge badge-default',
          'in-progress': 'badge badge-default',
          fail: 'badge badge-danger',
          success: 'badge badge-success'
        }[this.state.exerciseState]
        const label = {
          unchecked: 'Nem ellenőrzött',
          'in-progress': 'Ellenőrzése...',
          fail: 'A megoldás hibás',
          success: 'A megoldás helyes'
        }[this.state.exerciseState]

        const hints = this.state.hints || []

        return (
          <form onSubmit={this.onSubmit}>
            <div className="">
              Feladat ellenőrzés állapota: <span className={cx}>{label}</span>
              <code>({JSON.stringify(this.state.validity)})</code>
            </div>

            <hr />

            <Markdown source={ex.description} />

            {pairsInOrder(ex.controls).map(([key, { controlType, controlProps, order }]) => (
              <div className="form-group " key={key}>
                <UserControls
                  {...{
                    controlType,
                    controlProps: { ...controlProps, name: key, onChange: this.onChange }
                  }}
                />
              </div>
            ))}

            <div className="form-group">
              {hints && (
                <ol>
                  {hints.map(item => (
                    <li key={item.key}>
                      <Markdown source={item.hint.text} />
                    </li>
                  ))}
                </ol>
              )}

              <div className="form-group">
                {this.state.hintsLeft > 0 ? (
                  <Button className="btn-sm btn-info" onAction={this.getNextHint}>
                    Következő tipp (még {this.state.hintsLeft} van)
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div>

            <Button submit className="btn btn-primary d-block mx-auto">
              Ellenőrzés
            </Button>
          </form>
        )
      }
    }
  )
)
