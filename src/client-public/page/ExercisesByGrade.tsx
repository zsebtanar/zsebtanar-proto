import * as React from 'react'
import { pathOr, pipe } from 'ramda'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { selectPublicExercisesById } from 'client-common/services/exercise'
import { getAllClassification, TAGS } from 'client-common/services/classification'
import { Markdown } from 'client-common/component/general/Markdown'
import { NavLink } from 'react-router-dom'
import { Loading } from 'client-common/component/general/Loading'
import { trackPage } from 'client-common/component/hoc/withTracker'
import { withTracker } from '../../client-common/component/hoc/withTracker'
import { ShowError } from '../../client-common/component/error/ShwoError'
import { NotFoundError } from '../../client-common/util/error'

const mapStateToProps = state => ({
  classification: state.classification
})

export const ExercisesByGrade = pipe(
  withTracker,
  withRouter,
  connect(mapStateToProps)
)(
  class extends React.Component<any, any> {
    state = { exercises: undefined, classification: undefined, error: undefined }

    componentDidMount() {
      if (this.props.classification) {
        this.initContent(this.props)
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.classification && nextProps.classification) {
        this.initContent(nextProps)
      }
    }

    initContent(props) {
      const { classification, match, location } = props
      const { grade } = match.params
      const gradeObj = classification.grade[grade]

      if (!gradeObj) {
        this.setState({ error: new NotFoundError() })
      } else {
        trackPage(location.pathname, { title: gradeObj.name })

        getAllClassification()
          .then(classification => {
            const ids = pathOr([], ['grade', grade, 'exercise'], classification)
            selectPublicExercisesById(ids).then(exercises => {
              this.setState({ classification, exercises })
            })
          })
          .catch(error => this.setState({ error }))
      }
    }

    render() {
      const { classification, match } = this.props
      const { error, exercises, classification: classificationData } = this.state
      const { grade } = match.params

      if (!classification) return <div />

      if (error) return <ShowError error={error} />

      return (
        <div className="row">
          <h2 className="col-12 my-4">{classification.grade[grade].name}</h2>

          {!exercises ? (
            <div className="my-5 m-auto">
              <Loading />
            </div>
          ) : (
            <div className="list-group col-md-10 col-sm -12 mx-auto">
              {exercises.map(ex => (
                <NavLink
                  key={ex._key}
                  to={`/exercise/${ex._key}`}
                  className="list-group-item list-group-item-action d-flex flex-column align-items-start"
                >
                  <div className="mb-1 d-flex w-100 ">
                    <Markdown source={ex.description} resources={ex.resources} />
                  </div>
                  <div>
                    {ex.classification.tags.map(tag => (
                      <span className="badge badge-secondary mx-1" key={tag}>
                        {classificationData[TAGS][tag].name}
                      </span>
                    ))}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }
  }
)
