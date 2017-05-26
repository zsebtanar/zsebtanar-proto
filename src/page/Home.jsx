import React, { Component } from 'react'
import { connect } from 'react-redux'

import TodoItem from '../component/TodoItem'
import * as PropTypes from 'prop-types'

class App extends Component {
  static propTypes = {
  }


  render () {
    return (
      <h1>Home</h1>
    )
  }
}

export default connect(({ }) => ({
    todos: []
  })
)(App)