import { values } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  classification: state.classification
})

export default connect(mapStateToProps)(class extends React.Component {
  state = {
    activeTab: 0
  }

  selectTab = (activeTab) => (e) => {
    e.preventDefault()
    this.setState({activeTab})
  }

  render () {
    const classification = this.props.classification
    if (!classification) return <div/>

    const {grade, subject} = classification
    const subjectArray = values(subject)
    const selectedSubject = subjectArray[this.state.activeTab]

    return (<div>
      <ul className="nav nav-pills nav-fill mb-4" role="tablist">
        {
          subjectArray.map((sub, idx) =>
            <li className="nav-item" key={sub._key}>
              <a className={`nav-link ${idx === this.state.activeTab ? 'active' : ''} `}
                 href={`#${sub._key}`}
                 onClick={this.selectTab(idx)}
                 role="tab"
              >{sub.name}</a>
            </li>
          )
        }
      </ul>
      <hr/>
      <div className="tab-content">
        <div className="tab-pane active" id={selectedSubject._key} role="tabpanel">
          <div className="row my-4">
            <h3 className="col-md-3">Témakörök</h3>
            <div className="col-md-9">
              {values(selectedSubject.topic).map((topic) =>
                <a href="#" key={topic._key} className="d-inline-block col-md-4 col-sm-6">{topic.name}</a>
              )}
            </div>
          </div>
          <hr/>
          <div className="row my-4">
            <h3 className="col-md-3">Osztályok</h3>
            <div className="col-md-9">
              {values(grade).map((g) =>
                <a href="#" key={g._key} className="d-inline-block col-md-4 col-sm-6">{g.name}</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
})
