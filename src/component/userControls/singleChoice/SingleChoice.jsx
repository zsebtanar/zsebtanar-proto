import React from 'react'

export default (class extends React.Component {
  // we need state here because: https://github.com/facebook/react/issues/10078
  state = { checked: null }
  onChange = (e) => {
    const checked = e.currentTarget.value;
    this.setState({checked})

    if (this.props.onChange)
      this.props.onChange({
        name: this.props.name,
        value: checked
      });
  }

  render() {
    return (<div className="single-choice">
      {(this.props.options || []).map(x => RadioInput(
        {...x, name: 'random', onChange: this.onChange, checked: this.state.checked === x.value}
      ))}
    </div>)
  }
})

const RadioInput = (props) => (
  <label className="custom-control custom-radio d-block" key={props.value}>
    <input {...props} type="radio" className="custom-control-input" required={props.required}/>
    <span className="custom-control-indicator"/>
    <span className="custom-control-description">{props.label}</span>
  </label>)