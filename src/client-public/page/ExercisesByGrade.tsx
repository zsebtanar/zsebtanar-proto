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

const mapStateToProps = state => ({
  classification: state.classification
})

export const ExercisesByGrade = pipe(withRouter, connect(mapStateToProps))(
  class extends React.Component<any, any> {
    state = { exercises: undefined, classification: undefined }

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
      const gradeName = classification.grade[grade].name

      trackPage(location.pathname, { title: gradeName })

      getAllClassification().then(classification => {
        const ids = pathOr([], ['grade', grade, 'exercise'], classification)
        selectPublicExercisesById(ids).then(exercises => {
          this.setState({ classification, exercises })
        })
      })
    }

    render() {
      const { classification, match } = this.props
      const { grade } = match.params

      if (!classification) return <div />

      return (
        <div>
          <h2>{classification.grade[grade].name}</h2>

          {!this.state.exercises ? (
            <Loading />
          ) : (
            <div className="list-group col-10 mx-auto">
              {this.state.exercises.map(ex => (
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
                        {this.state.classification[TAGS][tag].name}
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
