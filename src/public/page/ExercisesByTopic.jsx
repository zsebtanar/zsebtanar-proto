import { pipe } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => ({
  classification: state.classification
})

export default pipe(
  withRouter,
  connect(mapStateToProps)
)(class extends React.Component {
  render () {
    const {classification, match} = this.props

    if (!classification) return (<div/>)

    return (<div>
      <h2>{classification.subject[match.params.subject].name}</h2>
    </div>)
  }
})
