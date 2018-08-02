import * as React from 'react'
import { values } from 'ramda'
import { Loading } from 'client-common/component/general/Loading'
import { getAllFeedback } from 'client-common/services/feedback'

const feedbackTypes = {
  note: 'Megjegyzés',
  error: 'Hiba'
}

const feedbackTypeClasses = {
  note: 'badge badge-info',
  error: 'badge badge-danger'
}

const feedbackStates = {
  new: 'Új',
  done: 'Kész'
}

export class FeedbackList extends React.Component<any, any> {
  state = {
    feedbackList: undefined
  }

  loadList = () => {
    getAllFeedback().then(feedbackList => this.setState({ feedbackList: values(feedbackList) }))
  }

  componentWillMount() {
    this.loadList()
  }

  render() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Visszajelzések</h3>
        </div>
        {this.state.feedbackList ? (
          <table className="table table-hover table mt-3 exercise-list-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Oldal</th>
                <th>Típus</th>
                <th>Állapot</th>
                <th>E-mail</th>
                <th>Kelt.</th>
                <th>Leírás</th>
                <th className="text-center action-column">
                  <i className="fa fa-lg fa-cog" />
                </th>
              </tr>
            </thead>
            <tbody>{this.renderItem()}</tbody>
          </table>
        ) : (
          <Loading />
        )}
      </div>
    )
  }

  renderItem() {
    return this.state.feedbackList.map((fb, idx) => (
      <tr key={fb._key}>
        <td>{idx + 1}</td>
        <td>{fb.site}</td>
        <td>
          <span className={feedbackTypeClasses[fb.type]}>{feedbackTypes[fb.type]}</span>
        </td>
        <td>
          <span className="badge badge-secondary">{feedbackStates[fb.state || 'new']}</span>
        </td>
        <td>
          <a href={`mailto:${fb.email}`} title={`Levél küldése: ${fb.email}`}>
            <i className="fa fa-at" />
          </a>
        </td>
        <td>{new Date(fb._created).toLocaleDateString()}</td>
        <td>{fb.description}</td>
        <td />
      </tr>
    ))
  }
}
