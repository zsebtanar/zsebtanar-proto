import React from 'react'

export default (class extends React.Component {
  onChange = (e) => {
    console.log(e.currentTarget.value);
  }

  render() {
    return (<div className="single-choice">
      {this.props.options.map(x => RadioInput({...x, name: 'random', onChange: this.onChange}))}
    </div>)
  }
})

const RadioInput = (props) => (
  <label className="custom-control custom-radio d-block" key={props.value}>
    <input {...props} type="radio" className="custom-control-input"/>
    <span className="custom-control-indicator"/>
    <span className="custom-control-description">{props.label}</span>
  </label>)