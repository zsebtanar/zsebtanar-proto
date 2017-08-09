import { values } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

const mapStateToProps = state => ({
  classification: state.classification
})

export default connect(mapStateToProps)(function (props) {
  const classification = props.classification
  if (!classification) return <div/>

  const {grade, subject} = classification
  const subjectArray = values(subject)

  return (<div>
    <div className="row my-4">
      <h4 className="col-md-3">Osztályok</h4>
      <div className="col-md-9">
        {values(grade).map((g) =>
          <NavLink
            to={`/grade/${g._key}`}
            key={g._key}
            className="d-inline-block col-md-4 col-sm-6">
            {g.name}
          </NavLink>
        )}
      </div>
    </div>
    {
      subjectArray
        .filter(sub => sub.exercise)
        .map((sub, idx) =>
          <div className="tab-content" key={sub._key}>
            <hr/>
            <div className="tab-pane active" id={sub._key} role="tabpanel">
              <div className="row my-4">
                <h4 className="col-md-3">
                  {sub.name}
                </h4>
                <div className="col-md-9">
                  {values(sub.topic)
                    .filter(topic => topic.exercise)
                    .map((topic) =>
                      <NavLink
                        to={`/subject/${sub._key}/${topic._key}`}
                        key={topic._key}
                        className="d-inline-block col-md-4 col-sm-6">
                        {topic.name}
                      </NavLink>
                    )}
                </div>
              </div>
            </div>
          </div>)
    }
  </div>)
})
