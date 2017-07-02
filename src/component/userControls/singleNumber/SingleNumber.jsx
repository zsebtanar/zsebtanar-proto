import React from 'react'

export default function(props){
  const setSolution = (e) => {
    if (props.onChange)
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      });
  }


  return (<div className="single-number d-flex align-items-center">
    <span className="prefix">{props.prefix}</span>
    <input name={props.name} type="number" className="form-control" onChange={setSolution}/>
    <span className="postfix">{props.postfix}</span>
  </div>)
}
