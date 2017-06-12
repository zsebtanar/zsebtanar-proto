import {reduce, assocPath} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {createExerciseAction} from '../../store/actions/exercise'
import Markdown from '../../component/general/Markdown'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {createExercise: createExerciseAction})(
  class extends React.Component {
    state = {}

    saveExercise = (event) => {
      event.preventDefault()
      const inputs = event.target.querySelectorAll('[name]')
      this.props.createExercise(reduce((acc, {name, value}) => assocPath(name.split('.'), value, acc), {}, inputs))
    }

    update = (event) => {
      const {name, value} = event.currentTarget
      this.setState({[name]: value})
    }

    render() {
      return (
        <div>
          <h1>Add exercise</h1>

          <div className="row">
            <div className="col">{this.renderForm()}</div>
            <div className="col">{this.renderPreview()}</div>
          </div>
        </div>
      )
    }

    renderForm() {
      return (<form onSubmit={this.saveExercise}>
        <div className="form-group row">
          <label className="col-4 col-form-label">Subject: </label>
          <div className="col-8">
            <input className="form-control" type="text" name="classification.subject" onKeyUp={this.update}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Topic: </label>
          <div className="col-8">
            <input className="form-control" type="text" name="classification.topic" onKeyUp={this.update}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Grade: </label>
          <div className="col-8">
            <input className="form-control" type="text" name="classification.grade" onKeyUp={this.update}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Tags:</label>
          <div className="col-8">
            <input className="form-control" type="text" name="classification.tags" onKeyUp={this.update}/>
          </div>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <textarea className="form-control" name="description" onKeyUp={this.update} rows="10"/>
        </div>
        <h4>Solution 1</h4>
        <div className="form-group row">
          <label className="col-4 col-form-label">Input type:</label>
          <div className="col-8">
            <select name="inputType" className="form-control" onKeyUp={this.update}>
              <option value="number">Integer</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Solution: </label>
          <div className="col-8">
            <input className="form-control" type="number" name="solution" onKeyUp={this.update}/>
          </div>
        </div>
        <div className="col-sm-8 offset-sm-4">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>)
    }

    renderPreview(){
      const {subject, topic, description} = this.state
      return (<div>
        <h4>{subject || <Muted>Subject</Muted>} / {topic || <Muted>Topic</Muted>}</h4>
        {
          description
            ? <Markdown source={description}/>
            : <Muted>Description...</Muted>
        }
      </div>)
    }
  })