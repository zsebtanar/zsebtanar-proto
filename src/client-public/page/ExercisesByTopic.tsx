import * as React from 'react'
import { pathOr, pipe } from 'ramda'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { selectPublicExercisesById } from 'client-common/services/exercise'
import { getAllClassification, TAGS } from 'client-common/services/classification'
import { Markdown } from 'client-common/component/general/Markdown'
import { NavLink } from 'react-router-dom'
import { Loading } from 'client-common/component/general/Loading'
import { trackPage } from 'client-common/component/hoc/withTracker'
import { withTracker } from '../../client-common/component/hoc/withTracker'
import { ShowError } from '../../client-common/component/error/ShwoError'
import { NotFoundError } from '../../client-common/util/error'

interface ExercisesByTopicProps extends RouteComponentProps<{ subject: string; topic: string }> {}

interface ExercisesByTopicStateProps {
  classification: any
}

interface ExercisesByTopicState {
  exercises: any
  classification: any
  error: any
}

const mapStateToProps = state => ({
  classification: state.classification
})

export const ExercisesByTopic = pipe(
  withTracker,
  withRouter,
  connect<ExercisesByTopicStateProps, {}, ExercisesByTopicProps>(mapStateToProps)
)(
  class extends React.Component<
    ExercisesByTopicProps & ExercisesByTopicStateProps,
    ExercisesByTopicState
  > {
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

    private initContent(props) {
      const { classification, match, location } = props
      const { subject, topic } = match.params
      const subjectObj = classification.subject[subject]
      const topicObj = subjectObj && subjectObj.topic[topic]

      if (!subjectObj || !topicObj) {
        this.setState({ error: new NotFoundError() })
      } else {
        trackPage(location.pathname, { title: `${subjectObj.name} - ${topicObj.name}` })

        getAllClassification()
          .then(classification => {
            const ids = pathOr([], ['subject', subject, 'topic', topic, 'exercise'], classification)
            selectPublicExercisesById(ids).then(exercises => {
              this.setState({ classification, exercises })
            })
          })
          .catch(error => this.setState({ error }))
      }
    }

    render() {
      const { classification, match } = this.props
      const { subject, topic } = match.params
      const { error } = this.state

      if (!classification) return <div />

      if (error) return <ShowError error={error} />

      return (
        <div className="row">
          <h2 className="col-12 my-4">
            {classification.subject[subject].name}
            <small> {classification.subject[subject].topic[topic].name}</small>
          </h2>

          {this.renderContent()}
        </div>
      )
    }

    private renderContent() {
      if (this.state.exercises) {
        return this.renderList()
      } else {
        return (
          <div className="my-5 m-auto">
            <Loading />
          </div>
        )
      }
    }

    private renderList() {
      return (
        <div className="list-group col-md-10 col-sm -12 mx-auto">
          {this.state.exercises.map(this.renderListItem)}
        </div>
      )
    }

    private renderListItem = ex => {
      return (
        <NavLink
          key={ex._key}
          to={`/exercise/${ex._key}`}
          className="list-group-item list-group-item-action d-flex flex-column align-items-start"
        >
          <div className="mb-1 d-flex w-100 ">
            <Markdown source={ex.description} resources={ex.resources} />
          </div>
          <div>{ex.classification.tags.map(this.renderTag)}</div>
        </NavLink>
      )
    }

    private renderTag = tag => {
      return (
        <span className="badge badge-secondary mx-1" key={tag}>
          {this.state.classification[TAGS][tag].name}
        </span>
      )
    }
  }
)
