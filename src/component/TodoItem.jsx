import React, { Component } from 'react'
import * as PropTypes from 'prop-types'


class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object,
    id: PropTypes.string
  }

  render(){
    const {todo, id} = this.props
    const toggleDone = () => {

    }

    const deleteTodo = (event) => {

    }
    return (
      <li className="Todo">
        <input
          className="Todo-Input"
          type="checkbox"
          checked={todo.done}
          onChange={toggleDone}
        />
        {todo.text || todo.name}
        <button className="Todo-Button" onClick={deleteTodo}>
          Delete
        </button>
      </li>
    )
  }
}
export default TodoItem