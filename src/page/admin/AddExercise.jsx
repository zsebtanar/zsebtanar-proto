import {reduce} from 'ramda'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createExercise} from '../../store/actions'

const saveExercise = (props) => (event) => {
  event.preventDefault()
  const inputs = event.target.querySelectorAll('[name]')
  props.createExercise(reduce((acc, {name, value}) => ({...acc, [name]: value}), {}, inputs));
}

function AddExercise(props) {
  return (
    <div>
      <h1>Add exercise</h1>

      <form onSubmit={saveExercise(props)}>
        <div><label>Topics: <input type="text" name="math-topic"/></label></div>
        <div><label>Tags: <input type="text" name="tags"/></label></div>
        <div><label>Description: <textarea name="description"/></label></div>
        <h4>Solution 1</h4>
        <div><label>Input type: <select name="input-type">
          <option value="number">Integer</option>
        </select></label>
        </div>
        <div><label>Solution: <input type="number" name="solution"/></label></div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default connect(undefined, {createExercise})(AddExercise)