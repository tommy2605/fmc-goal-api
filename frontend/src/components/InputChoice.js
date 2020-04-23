import React from 'react'

const InputChoice = ({ id, label, choices }) => {
  return (
    <div className="form-group row">
      <label htmlFor={id} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select id={id} className="form-control">
          {
            choices.map(item => {
              return (
                <option key={item}>{item}</option>
              )
            })
          }
        </select>
      </div>
    </div>
  )
}

export default InputChoice