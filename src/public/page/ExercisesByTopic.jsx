import { pathOr, pipe } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { selectPublicExercisesById } from 'shared/services/exercise'
import { getAllClassification, TAGS } from 'shared/services/classification'
import { Markdown } from 'shared/component/general/Markdown'
import { NavLink } from 'react-router-dom'
import Loading from 'shared/component/general/Loading'
import { trackPage } from '../../shared/component/hoc/withTracker'

const mapStateToProps = state => ({
  classification: state.classification
})

export const ExercisesByTopic = pipe(withRouter, connect(mapStateToProps))(
  class extends React.Component {
    state = { exercises: undefined }

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
      const { subject, topic } = match.params
      const subjectName = classification.subject[subject].name
      const topicName = classification.subject[subject].topic[topic].name

      trackPage(location.pathname, { title: `${subjectName} - ${topicName}` })

      getAllClassification().then(classification => {
        const ids = pathOr([], ['subject', subject, 'topic', topic, 'exercise'], classification)
        selectPublicExercisesById(ids).then(exercises => {
          this.setState({ classification, exercises })
        })
      })
    }

    render() {
      const { classification, match } = this.props
      const { subject, topic } = match.params

      if (!classification) return <div />

      return (
        <div>
          <h2>
            {classification.subject[subject].name}
            <small> {classification.subject[subject].topic[topic].name}</small>
          </h2>

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
